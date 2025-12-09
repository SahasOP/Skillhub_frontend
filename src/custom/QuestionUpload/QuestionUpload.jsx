import React from "react";
import Input from "@/ui/Input";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const QuestionUpload = ({ onQuestionsLoaded }) => {
  const csvTemplate = `type,question,a,b,c,d,correctOption,answer
mcq,What is 2+2?,3,4,5,6,B,
directAnswer,What is Newton's 2nd law,,,,,,F = ma
mcq,Capital of France?,Berlin,London,Paris,Madrid,C,
directAnswer,CSS stands for,,,,,,Cascading Style Sheets
`;

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const questions = parseQuestionsFromRows(results.data);
          onQuestionsLoaded(questions);
          toast.success(`${questions.length} questions loaded from CSV.`);
        },
        error: () => toast.error("Failed to parse CSV file."),
      });
    } else if (ext === "xls" || ext === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const questions = parseQuestionsFromRows(jsonData);
      onQuestionsLoaded(questions);
      toast.success(`${questions.length} questions loaded from Excel.`);
    } else {
      toast.error("Please upload a CSV or Excel file (.csv, .xls, .xlsx) only.");
    }
    // Reset input value to allow upload of same file again if needed
    event.target.value = "";
  };

  // Parses rows array into question objects
  const parseQuestionsFromRows = (rows) => {
    return rows
      .filter(
        (row) =>
          row.type &&
          (row.type.toLowerCase() === "mcq" ||
            row.type.toLowerCase() === "directanswer" ||
            row.type.toLowerCase() === "direct_answer")
      )
      .map((row, index) => {
        const type =
          row.type.toLowerCase() === "direct_answer"
            ? "directAnswer"
            : row.type.toLowerCase();
        if (type === "mcq") {
          return {
            questionNumber: index + 1,
            type,
            question: row.question || "",
            options: [row.a || "", row.b || "", row.c || "", row.d || ""],
            correctAnswer: (row.correctOption || "").toUpperCase(),
          };
        } else {
          return {
            questionNumber: index + 1,
            type,
            question: row.question || "",
            options: [],
            correctAnswer: row.answer || "",
          };
        }
      });
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-upload-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-4">
      <label className="block mb-1 font-semibold text-gray-700">
        Upload Questions (CSV or Excel)
      </label>
      <Input type="file" accept=".csv,.xls,.xlsx" onChange={handleFile} />
      <small className="block mt-1 text-gray-500 text-xs whitespace-pre-line">
        Supported format for MCQ: Type, Question, a, b, c, d, CorrectOption
        <br />
        Supported format for Direct Answer: Type, Question, Answer
        <br />
      </small>
      <button
        onClick={downloadTemplate}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        Download Sample Upload Template
      </button>
    </div>
  );
};

export default QuestionUpload;
