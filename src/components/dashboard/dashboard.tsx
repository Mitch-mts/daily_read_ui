"use client";

import { useState } from "react";
import { BOOKS } from "@/constants/books";
import { BibleReader } from "@/components/dashboard/bible-reader";
import { FavoritesModal } from "@/components/dashboard/favorites-modal";
import { HeroSection } from "@/components/dashboard/hero-section";
import { InspirationCard } from "@/components/dashboard/inspiration-card";
import { NamePromptModal } from "@/components/dashboard/name-prompt-modal";
import { FavoritesPanel } from "@/components/dashboard/panels/favorites-panel";
import { GoalsPanel } from "@/components/dashboard/panels/goals-panel";
import { HistoryPanel } from "@/components/dashboard/panels/history-panel";
import { NotesPanel } from "@/components/dashboard/panels/notes-panel";
import { ReadingPlansPanel } from "@/components/dashboard/panels/reading-plans-panel";
import { SettingsPanel } from "@/components/dashboard/panels/settings-panel";
import { PrayerCard } from "@/components/dashboard/prayer-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ReadingSelector } from "@/components/dashboard/reading-selector";
import { ToastNotification } from "@/components/dashboard/toast-notification";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { useGreeting, useDateLabel } from "@/hooks/useGreeting";
import { useReadingSession } from "@/hooks/useReadingSession";
import { useUserName } from "@/hooks/useUserName";
import type { NavItem } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const session = useReadingSession();
  const { name, needsName, saveName } = useUserName();
  const greeting = useGreeting(name);
  const dateLabel = useDateLabel();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarItemClick = (item: NavItem) => {
    setSidebarOpen(false);
    session.navigateToSection(item.section);
  };

  const handleBookChangeFromSelector = (name: string) => {
    const book = BOOKS.find((entry) => entry.book === name);
    session.setBookName(name || "Select Book");
    session.setBookId(book?.id ?? "");
    session.setChapterId("");
    session.setVerseId("");
  };

  const handleStartReading = () => {
    session.navigateToSection("read");
    window.setTimeout(() => {
      document.getElementById("read")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleContinueReading = () => {
    session.navigateToSection("read");
    session.handleContinueReading();
  };

  const chapterProgress =
    session.chapterId !== "" && session.currentBook
      ? Math.round((session.chapterId / session.currentBook.chapters) * 100)
      : 0;

  const canSaveCurrent =
    session.isReading &&
    session.bookName !== "Select Book" &&
    session.chapterId !== "";

  const renderSection = () => {
    switch (session.activeSection) {
      case "home":
        return (
          <div className="space-y-8">
            <HeroSection
              onStartReading={handleStartReading}
              onContinueReading={handleContinueReading}
              hasLastReading={session.hasLastReading}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <InspirationCard />
              <PrayerCard />
            </div>
            <QuickActions
              onRandomVerse={() => {
                void session.handleRandomVerse();
              }}
              onReadBible={() => session.navigateToSection("read")}
              onFavorites={session.showFavorites}
              onHistory={() => session.navigateToSection("history")}
            />
          </div>
        );

      case "read":
        return (
          <div className="space-y-8">
            <ReadingSelector
              testamentFilter={session.testamentFilter}
              setTestamentFilter={session.setTestamentFilter}
              bookName={session.bookName}
              setBookName={handleBookChangeFromSelector}
              setBookId={session.setBookId}
              chapterId={session.chapterId}
              setChapterId={session.setChapterId}
              verseId={session.verseId}
              setVerseId={session.setVerseId}
              readSingleVerse={session.readSingleVerse}
              setReadSingleVerse={session.setReadSingleVerse}
              bookList={session.bookList}
              chapterNumbers={session.chapterNumbers}
              isLoading={session.isLoading}
              onOpenReading={session.handleOpenReading}
            />

            <div
              className={cn(
                "grid gap-8",
                session.isReading ? "lg:grid-cols-3" : "lg:grid-cols-1",
              )}
            >
              <div className={cn(session.isReading && "lg:col-span-2", "space-y-8")}>
                <BibleReader
                  panelRef={session.readingPanelRef}
                  bookName={session.bookName}
                  chapterId={session.chapterId}
                  activeVerseId={session.activeVerseId}
                  currentBookChapters={session.currentBook?.chapters}
                  verses={session.verses}
                  isLoading={session.isLoading}
                  readingMode={session.readingMode}
                  canGoPrev={session.canGoPrev}
                  canGoNext={session.canGoNext}
                  verseCount={session.verseCount}
                  onPrev={session.handlePrevChapter}
                  onNext={session.handleNextChapter}
                  onIncreaseFont={session.increaseFont}
                  onDecreaseFont={session.decreaseFont}
                  onShare={() => void session.handleCopyChapter()}
                  onBookmark={session.addToFavorites}
                  onFavoriteVerse={session.addVerseToFavorites}
                  isVerseFavorited={session.isVerseFavorited}
                  onClear={session.handleClearReading}
                  onAudio={session.handleAudioPlayback}
                  isAudioPlaying={session.isAudioPlaying}
                  chapterProgress={chapterProgress}
                />

                {!session.isReading && (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
                    <p className="font-display text-lg text-muted-foreground">
                      Choose a book and chapter to begin your reading
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground/80">
                      Scripture will appear here in elegant, distraction-free typography
                    </p>
                  </div>
                )}
              </div>

              {session.isReading && (
                <div className="space-y-6">
                  <InspirationCard />
                  <PrayerCard />
                </div>
              )}
            </div>
          </div>
        );

      case "favorites":
        return (
          <FavoritesPanel
            favorites={session.favoriteVerses}
            onOpen={session.openFavorite}
            onRemove={session.removeFavorite}
            onSaveCurrent={session.addToFavorites}
            canSaveCurrent={canSaveCurrent}
          />
        );

      case "plans":
        return (
          <ReadingPlansPanel
            planProgress={session.planProgress}
            onStart={session.handleStartPlan}
            onMarkDay={session.handleMarkPlanDay}
          />
        );

      case "notes":
        return (
          <NotesPanel
            notes={session.notes}
            currentReference={
              session.passageReference || undefined
            }
            onAdd={session.handleAddNote}
            onUpdate={session.handleUpdateNote}
            onRemove={session.handleRemoveNote}
          />
        );

      case "history":
        return (
          <HistoryPanel
            history={session.readingHistory}
            onOpen={session.openHistoryEntry}
            onClear={session.handleClearHistory}
          />
        );

      case "goals":
        return (
          <GoalsPanel
            journey={session.journey}
            progressPercent={session.progressPercent}
            booksReadCount={session.booksReadCount}
          />
        );

      case "settings":
        return (
          <SettingsPanel
            readingMode={session.readingMode}
            onIncreaseFont={session.increaseFont}
            onDecreaseFont={session.decreaseFont}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div id="home" className="flex min-h-screen bg-background">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {session.liveMessage}
      </div>

      <div className="hidden lg:block">
        <Sidebar
          journey={session.journey}
          progressPercent={session.progressPercent}
          activeSection={session.activeSection}
          onNavClick={handleSidebarItemClick}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              journey={session.journey}
              progressPercent={session.progressPercent}
              activeSection={session.activeSection}
              onNavClick={handleSidebarItemClick}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar
          greeting={greeting}
          dateLabel={dateLabel}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main id="read" className="flex-1 space-y-8 p-4 lg:p-8">
          {renderSection()}
        </main>

        <footer className="border-t border-border/60 px-8 py-6 text-center text-xs text-muted-foreground">
          &copy; Daily Bible Reader · Crafted by Mitch
        </footer>
      </div>

      {session.toast && (
        <ToastNotification
          toast={session.toast}
          onDismiss={() => session.setToast(null)}
        />
      )}

      {session.modal && (
        <FavoritesModal
          modal={session.modal}
          favorites={session.favoriteVerses}
          expandedId={session.expandedFavoriteId}
          onExpand={session.setExpandedFavoriteId}
          onOpen={session.openFavorite}
          onRemove={session.removeFavorite}
          onClose={() => session.setModal(null)}
        />
      )}

      {needsName && <NamePromptModal onSubmit={saveName} />}
    </div>
  );
}
