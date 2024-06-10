import * as cheerio from "cheerio";
export default function App() {
  const link = document.createElement("a");

  const handleClick = () => {
    const data: string =
      document.querySelector(".SetPageTerms-termsList")?.innerHTML || "";
    const $ = cheerio.load(data);

    // File content
    const outputLines: any[] = [];

    $(".SetPageTerms-term .sebjgj3").each((_i, e) => {
      console.log(_i);
      let questionText = $(e).find("div:nth-child(1)").html()?.trim();

      // Split the text by <br> tags
      const questionLines = questionText
        ?.split("<br>")
        .map((line) => line.trim());

      const answers: any[] = [];
      questionLines?.forEach((line, _index) => {
        if (line.replace(/(<([^>]+)>)/gi, "").charAt(1) == ".") {
          answers.push(line.replace(/(<([^>]+)>)/gi, ""));
          questionText?.replace(line, "");
        }
      });
      questionText = questionText?.replace(/(<([^>]+)>)/gi, "");

      // console.log("question");
      // console.log(questionText);
      // console.log("answers:");
      // console.log(answers);
      let key: any = $(e).find("div:nth-child(2)").text().trim();
      key = key?.split("").map((e: any) => {
        return answers.find(
          (ans: any) => ans.charAt(0).toLowerCase() === e.toLowerCase()
        );
      });
      // console.log("key");
      // console.log(key);

      const outputLine = `${questionText} | ${key.join(", ")}`;
      outputLines.push(outputLine);
      // const value = $(e).attr("value");
    });
    const file = new Blob([outputLines.join("\n")], { type: "text/plain" });

    link.href = URL.createObjectURL(file);

    link.download = "questions_and_keys.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <div
      className="w-[300px] py-4 px-8 rounded-lg border-2 border-black bg-indigo-400 text-xl hover:bg-white hover:text-black"
      onClick={handleClick}
    >
      Get all Flashcards
    </div>
  );
}
