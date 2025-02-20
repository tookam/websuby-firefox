const apiUrl = 'https://api.websuby.com/translate';

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        const language = localStorage.getItem('language') || 'en';

        if (!/\.(srt|vtt)(\?|$)/.test(details.url)) {
            return {};
        }

        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: "pauseVideos" });
        });

        const type = details.url.includes('.srt') ? 'srt' : 'vtt';

        try {
            const filter = browser.webRequest.filterResponseData(details.requestId);
            const decoder = new TextDecoder("utf-8");
            const encoder = new TextEncoder();

            let responseText = "";

            filter.ondata = (event) => {
                responseText += decoder.decode(event.data, { stream: true });
            };

            filter.onstop = async () => {
                try {
                    const rewriteResponse = await fetch(apiUrl, {
                        // method: 'GET',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subtitles: responseText, language, type })
                    });

                    if (!rewriteResponse.ok) {
                        throw new Error('Translation API failed');
                    }

                    const translatedText = await rewriteResponse.text();
                    filter.write(encoder.encode(translatedText));
                } catch (error) {
                    console.error("Translation failed:", error);
                    filter.write(encoder.encode(responseText)); // Fallback to original content
                }
                filter.close();
            };

            return {};
        } catch (error) {
            console.error('Error processing request:', error);
            return {};
        } finally {
            browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { action: "resumeVideos" });
            });
        }
    },
    { urls: ["<all_urls>"], types: ["xmlhttprequest", "sub_frame", "main_frame"] },
    ["blocking"]
);
