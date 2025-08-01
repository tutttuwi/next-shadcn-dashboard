import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sigin-view';

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.'
};

/**
 * サインイン画面
 * @returns
 */
export default async function Page() {
  /**
   * Star数のデフォルト値
   */
  let stars = 3000; // Default value

  try {
    /**
     * GithubAPIから情報取得
     */
    const response = await fetch(
      'https://api.github.com/repos/kiranism/next-shadcn-dashboard-starter',
      {
        next: { revalidate: 3600 }
      }
    );

    if (response.ok) {
      const data = await response.json();
      stars = data.stargazers_count || stars; // Update stars if API response is valid
    }
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
  }
  return <SignInViewPage stars={stars} />;
}
