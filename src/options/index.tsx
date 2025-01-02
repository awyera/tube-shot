import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [includeTitleAndUrl, setIncludeTitleAndUrl] = useState(false);
  const [videoInfo, setVideoInfo] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['screenshot', 'videoInfo'], ({ screenshot, videoInfo }) => {
      if (screenshot) {
        setScreenshot(screenshot);
      }
      if (videoInfo) {
        setVideoInfo(videoInfo);
      }
    });
  }, []);

  const handleDownload = () => {
    if (!screenshot) {
      return;
    }

    const a = document.createElement('a');
    a.href = screenshot;
    a.download = 'screenshot.png';
    a.click();
  };

  const handleShareToX = async () => {
    if (!screenshot) {
      return;
    }

    const blob = await fetch(screenshot).then((res) => res.blob());

    // copy screenshot to clipboard
    navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    let text = '';
    if (includeTitleAndUrl && videoInfo) {
      text = `${videoInfo.title}\n${videoInfo.url}`;
    }
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, '_blank');
  };

  if (!screenshot) {
    return <p>Screenshot is not found.</p>;
  }

  return (
    <div className="container mx-auto my-4 flex gap-4">
      <div>
        <img src={screenshot} width="640" height="360" alt="screenshot" />
      </div>
      <div className="mt-4 flex items-start justify-center gap-x-2">
        <button type="button" className="rounded bg-gray-500 px-2 py-4 text-white" onClick={handleDownload}>
          Download
        </button>
        <div className='flex flex-col items-start gap-1'>
          <button type="button" className="rounded bg-gray-500 px-2 py-4 text-white" onClick={handleShareToX}>
            Share to X
          </button>
          <label>
            <input type="checkbox" defaultChecked={includeTitleAndUrl} onChange={() => {console.log('a');setIncludeTitleAndUrl((x) => !x)}} />
            Include title and URL
          </label>
        </div>
      </div>
    </div>
  );
};

const target = document.querySelector('.root');
if (!target) {
  throw new Error('root is not found.');
}
const root = createRoot(target);

root.render(<App />);
