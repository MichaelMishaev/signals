import { INewsArticle } from '@/interface';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  article: INewsArticle;
  className?: string;
}

const NewsCard = ({ article, className }: NewsCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Market Analysis': 'badge-green',
      'SECP Updates': 'badge-yellow',
      'Trading Education': 'badge-blue',
      'Platform News': 'badge-purple',
      'Crypto News': 'badge-orange',
      'Forex News': 'badge-teal',
    };
    return colors[category] || 'badge-gray';
  };

  return (
    <article className="group">
      <div
        className={cn(
          'bg-white dark:bg-background-6 relative scale-100 overflow-hidden rounded-[20px] transition-transform duration-500 hover:scale-[102%] hover:transition-transform hover:duration-500 h-full',
          className,
        )}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`badge ${getCategoryColor(article.category)} text-xs font-medium`}>
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-secondary/60 dark:text-accent/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0">
                <path
                  d="M14.1641 2.49992H17.4974C17.7184 2.49992 17.9304 2.58772 18.0866 2.744C18.2429 2.90028 18.3307 3.11224 18.3307 3.33325V16.6666C18.3307 16.8876 18.2429 17.0996 18.0866 17.2558C17.9304 17.4121 17.7184 17.4999 17.4974 17.4999H2.4974C2.27638 17.4999 2.06442 17.4121 1.90814 17.2558C1.75186 17.0996 1.66406 16.8876 1.66406 16.6666V3.33325C1.66406 3.11224 1.75186 2.90028 1.90814 2.744C2.06442 2.58772 2.27638 2.49992 2.4974 2.49992H5.83073V0.833252H7.4974V2.49992H12.4974V0.833252H14.1641V2.49992ZM16.6641 9.16658H3.33073V15.8332H16.6641V9.16658Z"
                  className="fill-secondary dark:fill-stroke-8"
                />
              </svg>
              <time dateTime={article.publishDate}>{article.publishDate}</time>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary/60 dark:text-accent/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0">
                <path
                  d="M14.6813 4.97325L15.8921 3.76242L17.0705 4.94075L15.8596 6.15158C17.0561 7.64922 17.6337 9.54815 17.4739 11.4584C17.314 13.3686 16.4288 15.1451 15.0001 16.423C13.5713 17.701 11.7074 18.3833 9.7913 18.33C7.87515 18.2766 6.05215 17.4916 4.6967 16.1362C3.34125 14.7807 2.55625 12.9577 2.50291 11.0416C2.44957 9.12545 3.13193 7.2616 4.40987 5.83284C5.68781 4.40409 7.46432 3.51888 9.37453 3.35902C11.2847 3.19916 13.1837 3.77678 14.6813 4.97325ZM9.99964 16.6666C11.7677 16.6666 13.4634 15.9642 14.714 14.7139C15.9643 13.4637 16.6666 11.768 16.6666 9.99992C16.6666 8.23181 15.9643 6.53612 14.714 5.28588C13.4634 4.03564 11.7677 3.33325 9.99964 3.33325C8.23153 3.33325 6.53584 4.03564 5.2856 5.28588C4.03537 6.53612 3.33297 8.23181 3.33297 9.99992C3.33297 11.768 4.03537 13.4637 5.2856 14.7139C6.53584 15.9642 8.23153 16.6666 9.99964 16.6666Z"
                  className="fill-secondary dark:fill-stroke-8"
                />
              </svg>
              <span>{article.readTime}</span>
            </div>
          </div>

          <h3 className="text-heading-6 font-normal line-clamp-2 min-h-[3.5rem]">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              {article.title}
            </a>
          </h3>

          <p className="text-tagline-1 text-secondary/60 dark:text-accent/60 line-clamp-3 font-normal min-h-[4.5rem]">
            {article.excerpt}
          </p>

          {article.relatedSymbols && article.relatedSymbols.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stroke-2 dark:border-stroke-6">
              <span className="text-xs text-secondary/60 dark:text-accent/60">Related:</span>
              {article.relatedSymbols.map((symbol, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md font-medium">
                  {symbol}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-white hover:btn-primary dark:btn-transparent inline-flex items-center gap-2"
              aria-label={`Read full article: ${article.title}`}>
              <span>Read More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

NewsCard.displayName = 'NewsCard';
export default NewsCard;
