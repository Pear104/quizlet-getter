import * as cheerio from "cheerio";
import { useEffect, useState } from "react";
import {
  getCoursera,
  getDefinitionQuestion,
  getQuestionDefinition,
} from "./getByFormat";
export default function App() {
  const [format, setFormat] = useState("ques-def");
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
    const outputLines: any[] = [];

    // Loop through each question
    $(".SetPageTerms-term .sebjgj3").each((_i, e) => {
      // Get the content of the question and key
      let questionText = $(e).find("div:nth-child(1)").html()?.trim();
      let keys: any = $(e).find("div:nth-child(2)").text().trim();

      let outputLine = "";

      // Get the output line base on the format
      switch (format) {
        case "ques-def":
          outputLine = getQuestionDefinition(
            questionText + "",
            keys,
            delimiter
          );
          break;
        case "def-ques":
          outputLine = getDefinitionQuestion(
            questionText + "",
            keys,
            delimiter
          );
          break;
        case "coursera":
          outputLine = getCoursera(questionText + "", keys);
          break;
        default:
          outputLine = getQuestionDefinition(questionText + "", keys);
          break;
      }

      // Output question and key to the file
      outputLines.push(outputLine);
      // console.log(questionText);
      // console.log(answers);
      // console.log(key);
      // console.log(outputLines);
    });

    // Download the flashcard text file
    const file = new Blob([outputLines.join("\n")], { type: "text/plain" });
    link.href = URL.createObjectURL(file); // Create a url to download
    link.download = `${title}.txt`; // File name
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
              <option value="ques-def">Question - Definition</option>
              <option value="def-ques">Definition - Question</option>
            </select>
          </div>
          <div>
            <label htmlFor="cards" className="pr-4 font-semibold">
              Delimiter:
            </label>
            <input
              onChange={(e: any) => setDelimiter(e.target.value)}
              defaultValue={"|"}
              type="text"
              id="cards"
              name="cards"
              className="w-full mt-2 py-2 px-3 h-[48px] bg-blue-600 hover:bg-blue-500 focus-visible:outline-none text-lg font-semibold rounded-lg "
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
