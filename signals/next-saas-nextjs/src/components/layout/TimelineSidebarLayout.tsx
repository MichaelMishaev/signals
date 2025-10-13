import ChangelogContent from '../changelog/ChangelogContent';
import SignalsFeed from '../tradesignal/SignalsFeed';
import AdBanner from '../shared/banners/AdBanner';

const TimelineSidebarLayout = () => {
  return (
    <section className="bg-background-3 dark:bg-background-7">
      <div className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Mobile: Signals Feed First (Above Timeline) */}
          <div className="lg:hidden">
            <div className="space-y-6">
              {/* Banner at the top - Auto-detects platform */}
              <AdBanner position="side" />
              {/* Signals Feed below */}
              <SignalsFeed />
            </div>
          </div>

          {/* Timeline - Main Content (Center) */}
          <div className="lg:col-span-3">
            <div className="bg-background-1 dark:bg-background-6 rounded-2xl">
              <ChangelogContent />
            </div>
          </div>

          {/* Desktop: Sidebar - Signals Feed */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Banner at the top - Auto-detects platform */}
              <AdBanner position="side" />
              {/* Signals Feed below */}
              <SignalsFeed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSidebarLayout;
