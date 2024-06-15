import { useCallback, useEffect, useState } from 'react';
import githubLogo from './assets/github.svg';
import { Button, Pagination, Spin, message, Card } from "antd";
import './App.css';

interface NewsInfo {
  id: number;
  user: string;
  title: string;
  url: string;
  summary: string | null;
}

const API_HOST_LOCAL = 'http://127.0.0.1:8080';
const API_HOST_REMOTE = 'https://hacker-news-backend.baffinlee.workers.dev';
// @ts-ignore
let API_HOST = process.env.NODE_ENV === 'development'
  ? API_HOST_LOCAL
  : API_HOST_REMOTE;
const PAGE_SIZE = 10;

function App() {
  const [loading, setLoading] = useState(true);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsInfo[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [pageNow, setPageNow] = useState(1);
  const fetchNewsList = useCallback((page: number) => {
    setLoading(true);
    fetch(`${API_HOST}/news?pageNow=${page}&pageSize=${PAGE_SIZE}`)
      .then(res => res.json())
      .then((res: { list: NewsInfo[], count: number }) => {
        setNewsList(res.list);
        setNewsCount(res.count);
        setLoading(false);
      }).catch(err => {
        if (API_HOST === API_HOST_LOCAL) {
          message.warning('Fetch from local backend host failed, switch to production host.', 5);
          console.error(err);
          API_HOST = API_HOST_REMOTE;
          fetchNewsList(page);
          return;
        }
        setLoading(false);
        message.error(`Failed to fetch news list, error => ${err}`);
        console.error(err);
      });
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setPageNow(page);
    fetchNewsList(page);
  }, []);
  const handleScrapeNews = useCallback(() => {
    setScrapeLoading(true);
    fetch(`${API_HOST}/scrape-news`)
      .then(() => fetch(`${API_HOST}/summarize-news`))
      .then(() => {
        setScrapeLoading(false);
        message.success('Trigger scrape news and summarize job successfully!');
        setPageNow(1);
        fetchNewsList(1);
      }).catch(err => {
        setScrapeLoading(false);
        message.error(`Scrape news and summarize job failed, error => ${err}`);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchNewsList(1);
  }, []);

  return (
    <div className='app'>
      <header>
        <div className="container">
          <h1>HN Digest - AI-Powered Hacker News Summarizer</h1>
          <p>HN Digest is an innovative AI-powered project designed to provide concise and insightful summaries of Hacker News articles. Hacker News is a treasure trove of information on technology, startups, and programming, but the volume of content can be overwhelming. HN Digest leverages advanced natural language processing and machine learning algorithms to distill key points from the most popular and relevant Hacker News posts, making it easier for users to stay informed without spending hours sifting through articles.</p>
          <div className='btns'>
            <Button
              onClick={handleScrapeNews}
              loading={scrapeLoading}
              type='primary'
              shape="round"
            >Scrape news and summarize</Button>
          </div>
        </div>
      </header>
      <main>
        {newsList.length === 0 && !loading && (
          <p className='empty'>No news yet, please wait cron job to scrape news or trigger it manually.</p>
        )}
        {loading && <Spin size="large" />}
        {newsList.length !== 0 && (
          <ul className='news-list'>
            {newsList.map(item => (
              <li key={item.id}>
                <Card bordered={false}>
                  <a href={item.url} target='_blank'>
                    <h2>{item.title}</h2>
                  </a>
                  <div className='info'>
                    <a href={`https://news.ycombinator.com/user?id=${encodeURIComponent(item.user)}`} target='_blank'>
                      <span>by @{item.user}</span>
                    </a>
                    <a href={item.url} target='_blank'>
                      <span>, {item.url.match(/^https?:\/\/(.*?)(\/|$)/)?.[1] || ''}</span>
                    </a>
                  </div>
                  <p>{item.summary}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
        {newsCount > PAGE_SIZE && (
          <Pagination
            total={newsCount}
            pageSize={PAGE_SIZE}
            current={pageNow}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        )}
      </main>
      <footer>
        <a href="https://github.com/BaffinLee/Hacker-News-Summary" target="_blank">
          <img src={githubLogo} alt="GitHub" />
        </a>
      </footer>
    </div>
  )
}

export default App
