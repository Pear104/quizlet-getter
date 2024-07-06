import * as cheerio from "cheerio";
import { useState } from "react";
import {
  getCoursera,
  getDefinitionQuestion,
  getQuestionDefinition,
} from "./getByFormat";
export default function App() {
  const [format, setFormat] = useState("");
  const link = document.createElement("a");

  const handleClick = () => {
    // Get the raw html string
    const data: string =
      document.querySelector(".SetPageTerms-termsList")?.innerHTML || "";
    const $ = cheerio.load(data);

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
          outputLine = getQuestionDefinition(questionText + "", keys);
          break;
        case "def-ques":
          outputLine = getDefinitionQuestion(questionText + "", keys);
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
    link.download =
      document.querySelector(".biky2b7 > h1")?.textContent?.trim() + ".txt"; // File name
    link.click(); // Click the url to download
    URL.revokeObjectURL(link.href); // Invoke the download url
  };
  return (
    <div className="flex gap-8">
      <div
        className="w-[300px] py-4 px-8 rounded-lg border-2 border-black bg-indigo-400 text-xl hover:bg-white hover:text-black"
        onClick={handleClick}
      >
        Get all Flashcards
      </div>
      <div>
        <label htmlFor="cards" className="pr-4">
          Choose a format:
        </label>
        <select
          id="cards"
          name="cards"
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="ques-def">Question - Definition</option>
          <option value="def-ques">Definition - Question</option>
          <option value="coursera">Coursera Key</option>
        </select>
      </div>
    </div>
  );
}
