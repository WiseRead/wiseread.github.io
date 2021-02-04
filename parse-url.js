const UrlParse_DEFAULT_isLTR = true;
const UrlParse_DEFAULT_isSeparator = false;
const UrlParse_DEFAULT_isDarkTheme = false;

class UrlParse {
  constructor(urlString, checkHostname = false) {
    this.urlString = urlString;
    this.isLTR = UrlParse_DEFAULT_isLTR;
    this.isSeparator = UrlParse_DEFAULT_isSeparator;
    this.isDarkTheme = UrlParse_DEFAULT_isDarkTheme;
    this.downloadList = [];
    this.domainName = 'wiseread.github.io';
    this.domain = `https://${this.domainName}`;
    this.SPLIT_STRING = ",";

    if (!urlString) {
        return;
    }
    
    const url = new URL(urlString);

    if (checkHostname && url.hostname != this.domainName) {
        throw new Error('Host name should be: ' + this.domainName);
    }

    // LTR
    if (url.searchParams.get("ltr")) {
      const ltrString = url.searchParams.get("ltr");
      if (ltrString == "false") {
        this.isLTR = false;
      } else {
        this.isLTR = true;
      }
    }

    // Separator
    if (url.searchParams.get("separator")) {
      const separatorMode = url.searchParams.get("separator");
      if (separatorMode == "on") {
        this.isSeparator = true;
      } else {
        this.isSeparator = false;
      }
    }

    // Theme
    if (url.searchParams.get("theme")) {
      const theme = url.searchParams.get("theme");
      if (theme == "dark") {
        this.isDarkTheme = true;
      } else {
        this.isDarkTheme = false;
      }
    }

    // MultiLengths
    let chaptersLinksLength = [];

    if (url.searchParams.get("multilengths")) {
        const multichaptersString = url.searchParams.get("multilengths");
        chaptersLinksLength.push(...multichaptersString.split(this.SPLIT_STRING).map(n => parseInt(n)).filter(n => n));
        if (chaptersLinksLength.some(n => n < 1)) {
            throw new Error("Some chapters lengths are illegal");
        }
      }

    const downloadParamName = "download=";
    const downloadParamIndex = url.search.indexOf(downloadParamName);

    if (downloadParamIndex >= 0) {
        const downloadString = url.search.slice(
          downloadParamIndex + downloadParamName.length);
          
        if (downloadString) {
          // If no multilengths param
          if (chaptersLinksLength.length == 0) {
            this.downloadList.push(downloadString);
          }
          else {
            let startIndex = 0;
            for (let chapterIndex = 0; chapterIndex < chaptersLinksLength.length; chapterIndex++) {
              let chaptersLength = chaptersLinksLength[chapterIndex];
              let downloadUrl = downloadString.substr(startIndex, chaptersLength);
              this.downloadList.push(downloadUrl);
              startIndex += chaptersLength + this.SPLIT_STRING.length;
            }
          }
        }
    }
  }
  
  createUrl(isLTR, isSeparator, isDarkTheme, downloadList) {
    let cleanDownloadList = downloadList.filter(s => s);

    let ltrString = `${isLTR == UrlParse_DEFAULT_isLTR ? '' : (isLTR ? 'ltr=true' : 'ltr=false')}`;
    let separatorString = `${isSeparator == UrlParse_DEFAULT_isSeparator ? '' : (isSeparator ? 'separator=on' : 'separator=off')}`;
    let themeString = `${isDarkTheme == UrlParse_DEFAULT_isDarkTheme ? '' : (isDarkTheme ? 'theme=dark' : 'theme=light')}`;
    let multilengthsString = `${cleanDownloadList.length < 2 ? '' : 'multilengths=' + cleanDownloadList.map(s => s.length).join()}`;
    let downloadString = `${cleanDownloadList.length == 0 ? '' : 'download=' + cleanDownloadList.join()}`;
    
    let paramsString = [ltrString, separatorString, themeString, multilengthsString, downloadString].filter(s => s).join('&');

    if (paramsString.length > 0) {
        paramsString = `/?` + paramsString;
    }

    let final = `${this.domain}${paramsString}`;
    return final;
  }
}
