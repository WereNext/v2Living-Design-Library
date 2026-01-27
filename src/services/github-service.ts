/**
 * GitHub Service
 *
 * Handles fetching template repositories from GitHub
 */

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  /**
   * Fetch repository information
   */
  async getRepo(owner: string, repo: string): Promise<GitHubRepo> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    const headers = this.getHeaders();

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch contents of a directory or file
   */
  async getContents(owner: string, repo: string, path: string = ''): Promise<GitHubFile[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    const headers = this.getHeaders();

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Fetch raw file content
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    const headers = this.getHeaders();

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.encoding === 'base64' && data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }

    throw new Error('Unable to decode file content');
  }

  /**
   * Search for files by pattern (e.g., "tailwind.config")
   */
  async searchFiles(owner: string, repo: string, pattern: string): Promise<GitHubFile[]> {
    try {
      const contents = await this.getContents(owner, repo);
      const matches: GitHubFile[] = [];

      for (const item of contents) {
        if (item.type === 'file' && item.name.includes(pattern)) {
          matches.push(item);
        } else if (item.type === 'dir') {
          // Recursively search subdirectories (limited depth to avoid rate limits)
          try {
            const subContents = await this.getContents(owner, repo, item.path);
            matches.push(...subContents.filter(f => f.type === 'file' && f.name.includes(pattern)));
          } catch (e) {
            // Skip directories we can't access
            console.warn(`Could not search directory: ${item.path}`);
          }
        }
      }

      return matches;
    } catch (error) {
      console.error('Error searching files:', error);
      return [];
    }
  }

  /**
   * Find common config files in a repo
   */
  async findConfigFiles(owner: string, repo: string): Promise<{
    tailwindConfig?: GitHubFile;
    packageJson?: GitHubFile;
    themeFiles?: GitHubFile[];
    cssFiles?: GitHubFile[];
  }> {
    const rootContents = await this.getContents(owner, repo);

    const tailwindConfig = rootContents.find(f =>
      f.name === 'tailwind.config.js' ||
      f.name === 'tailwind.config.ts' ||
      f.name === 'tailwind.config.cjs' ||
      f.name === 'tailwind.config.mjs'
    );

    const packageJson = rootContents.find(f => f.name === 'package.json');

    // Look for theme files in common locations
    const themeFiles: GitHubFile[] = [];
    const cssFiles: GitHubFile[] = [];

    const commonThemePaths = ['src/styles', 'styles', 'src/theme', 'theme', 'app/styles'];

    for (const path of commonThemePaths) {
      try {
        const contents = await this.getContents(owner, repo, path);
        themeFiles.push(...contents.filter(f =>
          f.type === 'file' &&
          (f.name.includes('theme') || f.name.includes('variables'))
        ));
        cssFiles.push(...contents.filter(f =>
          f.type === 'file' &&
          (f.name.endsWith('.css') || f.name.endsWith('.scss'))
        ));
      } catch (e) {
        // Path doesn't exist, continue
      }
    }

    return {
      tailwindConfig,
      packageJson,
      themeFiles,
      cssFiles
    };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    return headers;
  }
}

export const githubService = new GitHubService();
