"use client";

import { useState } from "react";
import { BOOKS } from "@/constants/books";
import { BibleReader } from "@/components/dashboard/bible-reader";
import { FavoritesModal } from "@/components/dashboard/favorites-modal";
import { HeroSection } from "@/components/dashboard/hero-section";
import { InspirationCard } from "@/components/dashboard/inspiration-card";
import { PrayerCard } from "@/components/dashboard/prayer-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ReadingJourneyCard } from "@/components/dashboard/reading-journey-card";
import { ReadingSelector } from "@/components/dashboard/reading-selector";
import { ReflectionCard } from "@/components/dashboard/reflection-card";
import { ToastNotification } from "@/components/dashboard/toast-notification";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { useGreeting, useDateLabel } from "@/hooks/useGreeting";
import { useReadingSession } from "@/hooks/useReadingSession";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const session = useReadingSession();
  const greeting = useGreeting();
  const dateLabel = useDateLabel();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollToRead = () => {
    document.getElementById("read")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookChangeFromSelector = (name: string) => {
    const book = BOOKS.find((entry) => entry.book === name);
    session.setBookName(name || "Select Book");
    session.setBookId(book?.id ?? "");
    session.setChapterId("");
  };

  const chapterProgress =
    session.chapterId !== "" && session.currentBook
      ? Math.round((session.chapterId / session.currentBook.chapters) * 100)
      : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {session.liveMessage}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          journey={session.journey}
          progressPercent={session.progressPercent}
        />
      </div>

      {/* Mobile sidebar overlay */}
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
              onNavClick={() => setSidebarOpen(false)}
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

        <main className="flex-1 space-y-8 p-4 lg:p-8">
          <HeroSection
            onStartReading={scrollToRead}
            onContinueReading={session.handleContinueReading}
            hasLastReading={session.hasLastReading}
          />

          <ReadingSelector
            testamentFilter={session.testamentFilter}
            setTestamentFilter={session.setTestamentFilter}
            bookName={session.bookName}
            setBookName={handleBookChangeFromSelector}
            setBookId={session.setBookId}
            chapterId={session.chapterId}
            setChapterId={session.setChapterId}
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
                onClear={session.handleClearReading}
                onAudio={() => session.showComingSoon("Audio Bible")}
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

            <div id="favorites" className="space-y-6">
              <ReadingJourneyCard
                journey={session.journey}
                booksReadCount={session.booksReadCount}
                verseCount={session.verseCount}
                progressPercent={session.progressPercent}
              />
              <InspirationCard />
              <ReflectionCard />
              <PrayerCard />
            </div>
          </div>

          <QuickActions
            onRandomVerse={session.handleRandomVerse}
            onFavorites={session.showFavorites}
            onComingSoon={session.showComingSoon}
          />
        </main>

        <footer className="border-t border-border/60 px-8 py-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Daily Bible Reader · Crafted with care
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
    </div>
  );
}
