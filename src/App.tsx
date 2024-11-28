import * as cheerio from "cheerio";
import { useEffect, useState } from "react";
import { FormatConstructor } from "./utils";

export type FlashcardItem = {
  term: string;
  definition: string;
};

export default function App() {
  const [format, setFormat] = useState("txt");
  const [delimiter, setDelimiter] = useState("|");
  const link = document.createElement("a");

  // Get the raw html string
  const data: string =
    document.querySelector(".SetPageTerms-termsList")?.innerHTML || "";
  const $ = cheerio.load(data);

  // Get flashcard set title
  const title = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute("content")
    ?.replace(" Flashcards | Quizlet", "")
    ?.replace(" Flashcards", "");

  const handleClick = () => {
    // File content
    let outputLines: FlashcardItem[] = [];

    // Loop through each question
    $(".SetPageTerms-term .sebjgj3").each((_i, e) => {
      // Get the content of the term and definition
      let term: string =
        $(e)
          .find("div:nth-child(1) > div > div > span")
          .html() // Get the inner HTML, including tags
          ?.replace(/<br\s*\/?>/g, " ") // Replace <br> tags with spaces
          .replace(/\s+/g, " ")
          .replace('<span class="TermText notranslate lang-en">', "") // Normalize extra spaces (optional)
          .replace("</span>", "") // Normalize extra spaces (optional)
          .trim() || ""; // Trim leading and trailing spaces

      let definition: string = $(e).find("div:nth-child(2)").text()?.trim();

      outputLines.push({
        term: term,
        definition: definition,
      });
    });
    let result: string = "";
    switch (format) {
      case "txt":
        result = FormatConstructor.getTxt(outputLines, delimiter);
        break;
      case "json":
        result = FormatConstructor.getJson(outputLines);
        break;
      case "xml":
        result = FormatConstructor.getXml(outputLines);
        break;
      // case "anki":
      //   outputLines = outputLines.map((line) => line.trim());
      //   break;
      case "html":
        result = FormatConstructor.getHtml(outputLines);
        break;
      case "md":
        result = FormatConstructor.getMd(outputLines);
        break;
      case "yaml":
        result = FormatConstructor.getYaml(outputLines);
        break;
      case "csv":
        result = FormatConstructor.getTxt(outputLines, ",");
        break;
      default:
        result = FormatConstructor.getTxt(outputLines);
        break;
    }

    // Download the flashcard text file
    const file = new Blob([result], { type: "text/plain" });
    link.href = URL.createObjectURL(file); // Create a url to download
    link.download = `${title}.${format}`; // File name
    link.click(); // Click the url to download
    URL.revokeObjectURL(link.href); // Invoke the download url
  };
  return (
    <div className="w-full">
      <div className="text-3xl font-bold mb-3">{title}</div>
      <div className="flex gap-8">
        <div className="grid grid-cols-3 gap-6 items-end justify-around">
          <div>
            <label htmlFor="cards" className="pr-4 font-semibold mb-2">
              Choose a format:
            </label>
            <select
              id="cards"
              name="cards"
              onChange={(e) => setFormat(e.target.value)}
              className="w-full mt-2 py-3 h-[48px] px-2 bg-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-500 focus-visible:outline-none"
            >
              <option value="txt">TXT</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              {/* <option value="anki">Anki-Ready Format</option> */}
              <option value="md">Markdown</option>
              <option value="html">HTML</option>
              <option value="yaml">YAML</option>
              <option value="csv">CSV (not reccomended)</option>
            </select>
          </div>
          <div>
            <label htmlFor="cards" className="pr-4 font-semibold">
              Delimiter:
            </label>
            <input
              onChange={(e: any) => setDelimiter(e.target.value)}
              defaultValue={"|"}
              disabled={format !== "csv" && format !== "txt"}
              type="text"
              id="cards"
              name="cards"
              className="disabled:opacity-50 w-full mt-2 py-2 px-3 h-[48px] bg-blue-600 hover:bg-blue-500 focus-visible:outline-none text-lg font-semibold rounded-lg disabled:hover:bg-blue-600 disabled:text-gray-400"
            />
          </div>

          <div>
            <div
              className="cursor-pointer transition-all duration-200 font-semibold py-4 px-8 rounded-lg border-2 border-black bg-blue-800 text-xl hover:bg-white hover:text-black flex justify-center"
              onClick={handleClick}
            >
              Download
            </div>
          </div>
        </div>
      </div>
      <div className="text-xs font-semibold mt-2">
        Please remember to load all the flashcards before downloading
      </div>
    </div>
  );
}
