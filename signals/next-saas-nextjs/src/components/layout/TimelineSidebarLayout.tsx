import ChangelogContent from '../changelog/ChangelogContent';
import SignalsFeed from '../tradesignal/SignalsFeed';

const TimelineSidebarLayout = () => {
  return (
    <section className="bg-background-3 dark:bg-background-7">
      <div className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Timeline - Main Content (Center) */}
          <div className="lg:col-span-3">
            <div className="bg-background-1 dark:bg-background-6 rounded-2xl">
              <ChangelogContent />
            </div>
          </div>

          {/* Sidebar - Signals Feed */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SignalsFeed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSidebarLayout;
