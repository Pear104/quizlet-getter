export const getCoursera = (question: string, keys: string) => {
  // Split the text by <br> tags (For coursera's format flashcards)
  const questionLines = question?.split("<br>").map((line) => line.trim());

  // Get the answers
  const answers: any[] = [];
  questionLines?.forEach((line, _index) => {
    if (line.replace(/(<([^>]+)>)/gi, "").charAt(1) == ".") {
      answers.push(line.replace(/(<([^>]+)>)/gi, ""));
      question?.replace(line, "");
    }
  });

  // Clean the question string
  question = question?.replace(/(<([^>]+)>)/gi, "");

  // Get the keys
  const keyOutput = keys
    ?.split("")
    .map((e: any) =>
      answers.find(
        (ans: any) => ans.charAt(0).toLowerCase() === e.toLowerCase()
      )
    );
  return `${question} | ${keyOutput.join(", ")}`; // Have the format: Question + Answer | Key
};

export const getQuestionDefinition = (
  question: string,
  keys: string,
  delimiter: string = "|"
) => {
  question = question?.replace(/(<([^>]+)>)/gi, "");
  return `${question} ${delimiter} ${keys}`;
};

export const getDefinitionQuestion = (
  question: string,
  keys: string,
  delimiter: string = "|"
) => {
  question = question?.replace(/(<([^>]+)>)/gi, "");
  return `${question} ${delimiter} ${keys}`;
};
