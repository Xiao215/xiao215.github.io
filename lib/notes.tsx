import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const notesDirectory = path.join(process.cwd(), "notes");
interface NoteData {
  id: string;
  [key: string]: string;
}
export function getSortedNotesData(courseDirectory): NoteData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(courseDirectory);
  const allPostsData: NoteData[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(courseDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
// interface NoteIdObject {
//   params: {
//     id: string;
//   };
// }
export function getCourseNoteIds(course: string): string[] {
  const courseDirectory = path.join(notesDirectory, course);
  const fileNames = fs.readdirSync(courseDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getCourses(): string[] {
  const entries = fs.readdirSync(notesDirectory, { withFileTypes: true });

  // Filter out all entries that are not directories
  const courseNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return courseNames;
}
export async function getNoteData(
  id: string,
  course: string
): Promise<NoteData> {
  const courseDirectory = path.join(notesDirectory, course);
  const fullPath = path.join(courseDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  // Use gray-matter to parse the post metadatanpm i @tailwindcss/typography section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().process(matterResult.content);
  let contentHtml = processedContent.toString();
  contentHtml = contentHtml.replace(/\\_/g, "_");
  contentHtml = contentHtml.replace(/\\\[/g, "[");
  contentHtml = contentHtml.replace(/\\\*/g, "*");
  contentHtml = contentHtml.replace(/\\</g, "<");

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
