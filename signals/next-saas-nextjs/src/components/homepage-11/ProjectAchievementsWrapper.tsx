'use client';

import OurAchievements from '@/components/shared/OurAchievements';
import { projectAchievements } from '@/data/achievements';

const ProjectAchievementsWrapper = () => {
  return <OurAchievements achievements={projectAchievements} instant={false} />;
};

export default ProjectAchievementsWrapper;
