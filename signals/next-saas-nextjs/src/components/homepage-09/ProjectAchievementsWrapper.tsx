'use client';

import OurAchievements from '@/components/shared/OurAchievements';
import { projectAchievements } from '@/data/achievements';

const ProjectAchievementsWrapper = () => {
  return <OurAchievements achievements={projectAchievements} className="dark:bg-background-8" instant={true} />;
};

export default ProjectAchievementsWrapper;
