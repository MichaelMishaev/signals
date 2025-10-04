'use client';

// Header v1
import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { navigationItems } from '@/data/header';
import { useNavbarScroll } from '@/hooks/useScrollHeader';
import { useProductionMode } from '@/hooks/useProductionMode';
import { cn } from '@/utils/cn';
import { FC } from 'react';
import MobileMenu from '../MobileMenu';
import AboutMenu from '../mega-menu/AboutMenu';
import BlogMenu from '../mega-menu/BlogMenu';
import HomeMegaMenu from '../mega-menu/HomeMegaMenu';
import PageMegaMenu from '../mega-menu/PageMegaMenu';
import ServicesMenu from '../mega-menu/ServicesMenu';
import LogoV2 from './LogoV2';
import MobileMenuButton from './MobileMenuButton';
import NavCTAButton from './NavCTAButton';
import NavItemLink from './NavItemLink';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavbarTwoProps {
  className?: string;
  megaMenuColor?: string;
  btnClassName?: string;
}

const NavbarTwo: FC<NavbarTwoProps> = ({ className, megaMenuColor, btnClassName }) => {
  const { isScrolled } = useNavbarScroll(150);
  const { isProductionMode, mounted } = useProductionMode();

  return (
    <MobileMenuProvider>
      <header>
        {/* Language Switcher - always visible */}
        <div className="ml-auto xl:ml-0 mr-4">
          <LanguageSwitcher />
        </div>
      </header>
    </MobileMenuProvider>
  );
};

NavbarTwo.displayName = 'NavbarTwo';
export default NavbarTwo;
