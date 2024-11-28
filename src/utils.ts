import { FlashcardItem } from "./App";

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class FormatConstructor {
  static getJson(data: FlashcardItem[]): string {
    return JSON.stringify(data);
  }

  static getTxt(data: FlashcardItem[], delimiter: string = "|"): string {
    return data
      .map((item) => `${item.term} ${delimiter} ${item.definition}`)
      .join("\n");
  }

  static getXml(json: FlashcardItem[]): string {
    let xml = "<flashcards>\n"; // Root element

    json.forEach((item) => {
      xml += "  <card>\n";
      xml += `    <term>${escapeXml(item.term)}</term>\n`;
      xml += `    <definition>${escapeXml(item.definition)}</definition>\n`;
      xml += "  </card>\n";
    });

    xml += "</flashcards>";
    return xml;
  }

  static getYaml(json: FlashcardItem[]): string {
    let yaml = "";

    json.forEach((item) => {
      yaml += `- term: "${item.term}"\n`;
      yaml += `  definition: "${item.definition}"\n`;
    });

    return yaml;
  }

  static getMd(json: FlashcardItem[]): string {
    let markdown = "";

    json.forEach((item) => {
      markdown += `- **${item.term}**: ${item.definition}\n`;
    });

    return markdown;
  }

  static getHtml(json: FlashcardItem[]): string {
    let html = `<table border="1" cellspacing="0" cellpadding="5">\n`;
    html += `  <thead>\n    <tr>\n      <th>Term</th>\n      <th>Definition</th>\n    </tr>\n  </thead>\n  <tbody>\n`;

    json.forEach((item) => {
      html += `    <tr>\n`;
      html += `      <td>${escapeHtml(item.term)}</td>\n`;
      html += `      <td>${escapeHtml(item.definition)}</td>\n`;
      html += `    </tr>\n`;
    });

    html += `  </tbody>\n</table>`;
    return html;
  }
}
