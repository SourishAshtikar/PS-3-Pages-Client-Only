"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGAS } from "@/lib/apiClient";
import { decryptObject } from "@/lib/crypto";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { useSession } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";
import FloatingBackground from "@/components/ui/FloatingBackground";
import ResourceHeader from "@/components/ui/ResourceHeader";
import { UttamLoader } from "@/components/ui/UttamLoader";
import {
  TrendingUp, TrendingDown, Layers, Target, Zap, Brain, FileText,
  ArrowRight, Clock, Book, ExternalLink, Globe, Activity, ShieldAlert, Send, BookOpen,
  Folder, FolderOpen, FileCode, Terminal, Play, CheckCircle, Calendar, Bug, Settings, Code,
  ChevronDown, ChevronRight, FileJson, Component, Palette, Monitor, Grid, MousePointer, Layout, Columns,
  Search, Bookmark, Award, Info, Check, Gamepad2, Presentation, Headphones, Home
} from "lucide-react";



// Theme Configuration lookup table used by fallback default and custom layouts
const THEME_MAP: Record<string, {
  bg: string;
  cardBg: string;
  borderClass: string;
  shadowClass: string;
  btnPrimary: string;
  btnGhost: string;
  titleHover: string;
  textHeading: string;
  textMuted: string;
  badge: string;
  pattern: string;
  iconColor: string;
}> = {
  "ui programming": {
    bg: "bg-[#FAF9F5] text-black font-sans",
    cardBg: "bg-white",
    borderClass: "border-2 border-black rounded-none",
    shadowClass: "shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(239,68,68,1)] hover:-translate-y-0.5",
    btnPrimary: "bg-[#EF4444] hover:bg-[#dc2626] text-white font-black uppercase text-[11px] tracking-wider px-3.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer rounded-none",
    btnGhost: "text-black hover:text-[#EF4444] font-bold text-xs bg-white hover:bg-slate-50 border-2 border-black rounded-none px-3 py-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all inline-flex items-center",
    titleHover: "group-hover:text-[#EF4444]",
    textHeading: "text-slate-900 font-black uppercase tracking-tight font-sans",
    textMuted: "text-zinc-655 font-bold",
    badge: "font-mono text-[9px] font-black uppercase tracking-wider text-white bg-zinc-900 px-2 py-0.5 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]",
    pattern: "",
    iconColor: "text-[#EF4444]"
  },

  "startup engineering": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-blue-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
    pattern: "",
    iconColor: "text-blue-600"
  },

  "python programming": {
    bg: "bg-[#F8FAFC] text-slate-750 font-mono font-jetbrains",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded",
    shadowClass: "shadow-xs hover:shadow-sm hover:-translate-y-0.5",
    btnPrimary: "bg-[#3776AB] hover:bg-[#2b5b84] text-white font-bold text-xs rounded shadow-xs py-2 px-4 transition-all font-mono",
    btnGhost: "text-slate-655 hover:text-[#3776AB] font-mono text-xs hover:bg-slate-50 border border-slate-200 rounded px-3 py-1.5 transition-all bg-white shadow-sm inline-flex items-center",
    titleHover: "group-hover:text-[#3776AB]",
    textHeading: "text-slate-900 font-bold tracking-tight font-mono",
    textMuted: "text-slate-500 font-mono",
    badge: "bg-blue-50 text-[#3776AB] border border-blue-200 rounded font-mono",
    pattern: "",
    iconColor: "text-[#3776AB]"
  },

  "digital business": {
    bg: "bg-[#F8FAFC] text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-xs hover:shadow-md hover:-translate-y-0.5",
    btnPrimary: "bg-[#0F766E] hover:bg-[#0d635c] text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-555 hover:text-[#0F766E] font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-[#0F766E]",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-[#0F766E]/5 text-[#0F766E] border border-[#0F766E]/10 px-2.5 py-1 rounded-lg",
    pattern: "strategy-board-dot",
    iconColor: "text-[#0F766E]"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#F8FAFC] text-slate-800 font-sans",
  cardBg: "bg-white",
  borderClass: "border border-slate-200 rounded-xl",
  shadowClass: "shadow-xs transition-all duration-200",
  btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
  btnGhost: "text-slate-555 hover:text-blue-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
  titleHover: "group-hover:text-blue-600",
  textHeading: "text-slate-900 font-bold tracking-tight font-sans",
  textMuted: "text-slate-500 font-medium font-sans",
  badge: "font-sans text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg",
  pattern: "",
  iconColor: "text-blue-600"
};

const brutalistThemeColors = [
  { bg: "bg-[#2dd4bf]", text: "text-[#2dd4bf]", hover: "group-hover:text-[#2dd4bf]" },
  { bg: "bg-[#f43f5e]", text: "text-[#f43f5e]", hover: "group-hover:text-[#f43f5e]" },
  { bg: "bg-[#fbbf24]", text: "text-[#fbbf24]", hover: "group-hover:text-[#fbbf24]" },
  { bg: "bg-[#a855f7]", text: "text-[#a855f7]", hover: "group-hover:text-[#a855f7]" },
  { bg: "bg-[#3b82f6]", text: "text-[#3b82f6]", hover: "group-hover:text-[#3b82f6]" },
  { bg: "bg-[#4ade80]", text: "text-[#4ade80]", hover: "group-hover:text-[#4ade80]" },
  { bg: "bg-[#ec4899]", text: "text-[#ec4899]", hover: "group-hover:text-[#ec4899]" },
];

const getDynamicTheme = (subjectId: string | null) => {
  if (!subjectId) return DEFAULT_THEME;
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % brutalistThemeColors.length;
  const theme = brutalistThemeColors[colorIndex];
  
  return {
    ...DEFAULT_THEME,
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    iconColor: theme.text,
    titleHover: theme.hover,
  };
};

const PYTHON_WORKSPACE_TOPICS = [
  {
    id: "basics",
    title: "01 Basics",
    files: [
      {
        name: "hello_world.py",
        code: `# hello_world.py\nprint("Hello, World!")\nprint("Welcome to Python Programming!")\n`,
        output: ["Hello, World!", "Welcome to Python Programming!"]
      },
      {
        name: "variables.py",
        code: `# variables.py\nx = 5\ny = 10\ntotal = x + y\nprint(f"x is {x}")\nprint(f"y is {y}")\nprint(f"Sum is {total}")\n`,
        output: ["x is 5", "y is 10", "Sum is 15"]
      }
    ]
  },
  {
    id: "control_flow",
    title: "02 Control Flow",
    files: [
      {
        name: "decisions.py",
        code: `# decisions.py\nscore = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"\nprint(f"Score: {score}")\nprint(f"Grade: {grade}")\n`,
        output: ["Score: 85", "Grade: B"]
      },
      {
        name: "loops.py",
        code: `# loops.py\nprint("Counting from 1 to 5:")\nfor i in [1, 2, 3, 4, 5]:\n    print(f"Number: {i}")\n`,
        output: ["Counting from 1 to 5:", "Number: 1", "Number: 2", "Number: 3", "Number: 4", "Number: 5"]
      }
    ]
  },
  {
    id: "data_structures",
    title: "03 Data Structures",
    files: [
      {
        name: "lists_demo.py",
        code: `# lists_demo.py\nfruits = ["apple", "banana", "cherry"]\nprint(f"My fruits: {fruits}")\nprint(f"First fruit: {fruits[0]}")\n`,
        output: ["My fruits: ['apple', 'banana', 'cherry']", "First fruit: apple"]
      },
      {
        name: "dicts_demo.py",
        code: `# dicts_demo.py\nstudent = {"name": "Alice", "age": 20}\nprint(f"Student Profile: {student}")\n`,
        output: ["Student Profile: {'name': 'Alice', 'age': 20}"]
      }
    ]
  },
  {
    id: "functions_oop",
    title: "04 Functions & OOP",
    files: [
      {
        name: "functions_demo.py",
        code: `# functions_demo.py\ndef add(a, b):\n    return a + b\n\nresult = add(7, 8)\nprint(f"7 + 8 = {result}")\n`,
        output: ["7 + 8 = 15"]
      },
      {
        name: "classes_demo.py",
        code: `# classes_demo.py\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return "Woof!"\n\nmy_dog = Dog("Buddy")\nprint(f"{my_dog.name} says {my_dog.bark()}")\n`,
        output: ["Buddy says Woof!"]
      }
    ]
  }
];

const PYTHON_FALLBACK_MODULES = [
  {
    id: "id_3rqsb6a8n",
    moduleNo: 1,
    title: "Data Types and Data Structures in Python",
    hours: 4,
    co: "CO1Demonstrate Proficiency in Python Fundamentals",
    subtopics: [
      { id: "id_h03iisfyq", title: "Data Types in Python, Whitespace, Code Block Indentation, Comments, Variables, reserved key words, Naming conventions, Python’s built-in type" },
      { id: "id_w7k4u8j07", title: "Operators in Python, Basic built-in Math functions" },
      { id: "id_jootxqine", title: "Strings , format(), print(), type casting in python" },
      { id: "id_dbuxrnh7s", title: "Data Structures: Tuples, List, Dictionaries, Set, Arrays,Conversion of data structures methods" }
    ]
  },
  {
    id: "id_0w0xo2oy6",
    moduleNo: 2,
    title: "Decision Making and Functions in python",
    hours: 6,
    co: "CO2: Implement Core Data Structures and Control Flow",
    subtopics: [
      { id: "id_sub2_1", title: "If statement: if, if-else, elif, Nested if, pass statement" },
      { id: "id_sub2_2", title: "Repetition using While loop, for loop & range function, break, continue and pass statement" },
      { id: "id_sub2_3", title: "Defining a Function, Checking & Setting Parameters Types of arguments" },
      { id: "id_sub2_4", title: "Pass statement in function, Nested Functions, Scope of variables" },
      { id: "id_sub2_5", title: "Recursion, Lambda and Filter, Map, Shallow Copy, Deep Copy, Decorators" }
    ]
  },
  {
    id: "id_9tunlumba",
    moduleNo: 3,
    title: "Python exception and file handling",
    hours: 6,
    co: "CO2: Implement Core Data Structures and Control Flow",
    subtopics: [
      { id: "id_sub3_1", title: "Error, Types of error: Runtime error, compile type error, logical error, Exceptions Handling and Assertions" },
      { id: "id_sub3_2", title: "Types of Files in Python, Opening a File: File opening modes, Closing a File, Writing Text Files, Appending in Text Files" },
      { id: "id_sub3_3", title: "Working with Binary Files, File Exceptions" }
    ]
  },
  {
    id: "id_pbx0ox3nc",
    moduleNo: 4,
    title: "Pandas and Seaborn CO3: Analyze and Visualize Data",
    hours: 8,
    co: "CO3: Analyze and Visualize Data",
    subtopics: [
      { id: "id_sub4_1", title: "NumPy and Matplotlib: Summary of NumPy arrays,functions, applications, matplotlib plots and graphs" },
      { id: "id_sub4_2", title: "PANDAS: Series and Dataframes, read /write data frames from/to csv files, json files, excel files" },
      { id: "id_sub4_3", title: "Sorting and Searching: Sort by label, sort by value, Pattern Matching using regex" },
      { id: "id_sub4_4", title: "SEABORN: Intro and supported data types" },
      { id: "id_sub4_5", title: "Plots and Charts - I: Line, Bar, Box, Pair, Scatter,Histogram, Pie charts." },
      { id: "id_sub4_6", title: "Types of Plots - II: Regression, Density, Distribution" }
    ]
  },
  {
    id: "id_u9nlx750x",
    moduleNo: 5,
    title: "GUI design & Database Connectivity using Python",
    hours: 6,
    co: "CO4: Develop Basic Applications and Connectivity",
    subtopics: [
      { id: "id_sub5_1", title: "GUI Programming Toolkits, Creating GUI Widgets with Tkinter, Creating Layouts, Form Components, Dialog Boxes, Event creation" },
      { id: "id_sub5_2", title: "Types of Databases Used with Python, Mysql database Connectivity with Python, SQL Relational Databases" },
      { id: "id_sub5_3", title: "Socket Programming using Python" }
    ]
  }
];

const executePythonSim = (code: string): string[] => {
  const logs: string[] = [];
  const lines = code.split("\n");
  const variables: Record<string, any> = {};

  try {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      // Basic support for print statements
      if (line.startsWith("print(") && line.endsWith(")")) {
        const content = line.substring(6, line.length - 1).trim();

        // Evaluate literal strings: "..." or '...'
        if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
          logs.push(content.substring(1, content.length - 1));
        }
        // Evaluate f-strings: f"..." or f'...'
        else if (content.startsWith("f\"") || content.startsWith("f'")) {
          let fstr = content.substring(2, content.length - 1);
          const matches = fstr.match(/\{[^}]+\}/g);
          if (matches) {
            for (const match of matches) {
              const varName = match.substring(1, match.length - 1).trim();
              if (varName in variables) {
                fstr = fstr.replace(match, String(variables[varName]));
              } else {
                fstr = fstr.replace(match, `<NameError: name '${varName}' is not defined>`);
              }
            }
          }
          logs.push(fstr);
        }
        // Evaluate variables or math expression
        else {
          if (content in variables) {
            logs.push(String(variables[content]));
          } else {
            // Check if it is math
            try {
              let evalExpr = content;
              for (const varName in variables) {
                const regex = new RegExp('\\b' + varName + '\\b', 'g');
                evalExpr = evalExpr.replace(regex, String(variables[varName]));
              }
              if (/^[0-9+\-*\/().\s-]+$/.test(evalExpr)) {
                logs.push(String(eval(evalExpr)));
              } else {
                logs.push(content);
              }
            } catch {
              logs.push(`NameError: name '${content}' is not defined`);
            }
          }
        }
      }
      // Simple variable assignment: name = expression
      else if (line.includes("=") && !line.includes("==") && !line.startsWith("def ") && !line.startsWith("class ")) {
        const parts = line.split("=");
        const varName = parts[0].trim();
        const valueExpr = parts.slice(1).join("=").trim();

        if (/^[a-zA-Z_]\w*$/.test(varName)) {
          // If string literal
          if ((valueExpr.startsWith('"') && valueExpr.endsWith('"')) || (valueExpr.startsWith("'") && valueExpr.endsWith("'"))) {
            variables[varName] = valueExpr.substring(1, valueExpr.length - 1);
          }
          // If list or dict literal
          else if ((valueExpr.startsWith("[") && valueExpr.endsWith("]")) || (valueExpr.startsWith("{") && valueExpr.endsWith("}"))) {
            variables[varName] = valueExpr;
          }
          // If math or reference evaluation
          else {
            try {
              let evalExpr = valueExpr;
              for (const v in variables) {
                const regex = new RegExp('\\b' + v + '\\b', 'g');
                evalExpr = evalExpr.replace(regex, String(variables[v]));
              }
              if (/^[0-9+\-*\/().\s-]+$/.test(evalExpr)) {
                variables[varName] = eval(evalExpr);
              } else if (valueExpr in variables) {
                variables[varName] = variables[valueExpr];
              } else {
                variables[varName] = valueExpr;
              }
            } catch {
              variables[varName] = valueExpr;
            }
          }
        }
      }
    }
  } catch (err: any) {
    logs.push(`SyntaxError: Invalid syntax - \${err.message}`);
  }

  if (logs.length === 0) {
    logs.push("(Program executed successfully with no output)");
  }
  return logs;
};

// Pure helper functions for syntax highlighting and file content generation inside Python Development Studio
const getCodeSnippet = (fileName: string, modTitle: string) => {
  if (fileName.startsWith("test_")) {
    return `# test_${fileName.replace("test_", "")}
import unittest
from ${fileName.replace("test_", "").replace(".py", "")} import *

class TestFeatures(unittest.TestCase):
    def test_run(self):
        self.assertTrue(True)
        print("✓ All tests executed successfully")

if __name__ == "__main__":
    unittest.main()
`;
  }

  if (fileName.endsWith(".md")) {
    return `# ${modTitle}
    
Workspace Documentation for the current project.
Learn Python step by step inside a professional IDE interface.

- Interactive Exercises
- Unit Testing Suite
- Performance Analysis
- Debug Challenges
`;
  }

  const titleLower = modTitle.toLowerCase();
  if (titleLower.includes("fundamental") || titleLower.includes("syntax") || titleLower.includes("intro")) {
    return `# fundamentals.py
def greet_developer(name: str) -> None:
    print(f"Welcome to Python Development Studio, {name}!")
    
    # Let's write a loop to print tech skills
    skills = ["VS Code", "PyCharm", "GitHub", "Jupyter"]
    for skill in skills:
        print(f"Integrating workspace: {skill}")

greet_developer("Pythonista")
`;
  } else if (titleLower.includes("data structure") || titleLower.includes("list") || titleLower.includes("dict")) {
    return `# data_structures.py
from typing import List, Dict

def analyze_complexity() -> Dict[str, str]:
    # Professional data structures syntax
    modules = ["List", "Dictionary", "Tuple", "Set"]
    complexity = {mod: "O(1) average lookup" for mod in modules}
    return complexity

print(analyze_complexity())
`;
  } else if (titleLower.includes("function") || titleLower.includes("def")) {
    return `# functions.py
import math

# Use clean modern type hinting
def calculate_velocity(completion_rate: float, time_spent: int) -> float:
    """
    Calculate the developer velocity index.
    """
    if time_spent <= 0:
        return 0.0
    return math.sqrt(completion_rate) * 10.0 / time_spent

print(f"Velocity Index: {calculate_velocity(0.85, 4)}")
`;
  } else if (titleLower.includes("oop") || titleLower.includes("class") || titleLower.includes("object")) {
    return `# oop.py
class PythonStudio:
    def __init__(self, theme: str = "DevStudio"):
        self.theme = theme
        self.status = "Initializing Build..."

    def run_tests(self) -> bool:
        print(f"[{self.theme}] Running unit tests...")
        return True

studio = PythonStudio("GitHub Dark")
studio.run_tests()
`;
  } else if (titleLower.includes("file") || titleLower.includes("handling") || titleLower.includes("io")) {
    return `# file_handling.py
import json

def load_config(filepath: str) -> dict:
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Configuration file not found"}

print(load_config("workspace_settings.json"))
`;
  }

  return `# ${fileName}
def main():
    print("Welcome to Python Development Studio!")
    print("Happy coding!")

if __name__ == "__main__":
    main()
`;
};

const highlightPythonCode = (code: string) => {
  if (!code) return null;

  const keywords = new Set(["def", "class", "import", "from", "return", "in", "for", "if", "else", "elif", "try", "except", "with", "as", "and", "or", "not", "lambda", "async", "await", "yield", "pass", "None", "True", "False"]);
  const builtins = new Set(["print", "math", "open", "json", "len", "range", "str", "int", "float", "bool", "list", "dict", "set", "tuple", "calculate_velocity", "greet_developer", "analyze_complexity", "load_config", "run_tests", "__init__"]);
  const types = new Set(["str", "int", "float", "bool", "List", "Dict", "dict", "None", "True", "False"]);

  // Token regex matching: whitespace, comment, double-quoted str, single-quoted str, number, word, symbol
  const tokenRegex = /(\s+)|(#[^\n]*)|("[^"]*")|('[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([^\w\s#]+)/g;

  let match;
  const elements: React.ReactNode[] = [];
  let keyIndex = 0;

  tokenRegex.lastIndex = 0;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(code)) !== null) {
    const [
      text,
      whitespace,
      comment,
      doubleStr,
      singleStr,
      number,
      word,
      symbol
    ] = match;

    if (match.index > lastIndex) {
      const unmatched = code.slice(lastIndex, match.index);
      elements.push(<span key={`unmatched-${keyIndex++}`}>{unmatched}</span>);
    }
    lastIndex = tokenRegex.lastIndex;

    if (whitespace) {
      elements.push(whitespace);
    } else if (comment) {
      elements.push(<span key={keyIndex++} className="text-[#6A9955] italic font-mono">{comment}</span>);
    } else if (doubleStr || singleStr) {
      elements.push(<span key={keyIndex++} className="text-[#A31515] font-mono">{doubleStr || singleStr}</span>);
    } else if (number) {
      elements.push(<span key={keyIndex++} className="text-[#098658] font-mono">{number}</span>);
    } else if (word) {
      if (keywords.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#0000FF] font-bold font-mono">{word}</span>);
      } else if (builtins.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#795E26] font-mono">{word}</span>);
      } else if (types.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#267F99] font-medium font-mono">{word}</span>);
      } else {
        elements.push(<span key={keyIndex++} className="text-slate-800 font-mono">{word}</span>);
      }
    } else if (symbol) {
      elements.push(<span key={keyIndex++} className="text-slate-600 font-medium font-mono">{symbol}</span>);
    }
  }

  if (lastIndex < code.length) {
    const trailing = code.slice(lastIndex);
    elements.push(<span key={`trailing-${keyIndex++}`}>{trailing}</span>);
  }

  return <>{elements}</>;
};

// Premium 3D Tilt Card (Overlays removed per request)
const DesignStudioCard = ({ children, className = "", style = {}, isPremium, label, ...props }: any) => {
  return (
    <div
      className={`relative transition-all duration-300 ease-out rounded-md ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

const CASE_STUDIES = [
  {
    id: "netflix",
    company: "Netflix",
    tag: "Media & Entertainment",
    tagClass: "bg-rose-50 text-rose-700 border-rose-200/60",
    svgClass: "text-rose-600",
    summary: "From DVD rentals to global streaming platform.",
    watermark: "streaming",
    detailedBrief: {
      headline: "The DVD to Streaming Revolution",
      strategicShift: "Business model transition from physical asset logistics (mailing DVDs) to digital cloud distribution.",
      keyEnablers: [
        "Infrastructure migration to AWS cloud to support infinite scaling.",
        "Data-driven recommendation algorithms to drive engagement.",
        "Aggressive capital reinvestment in original IP production."
      ],
      outcome: "Dominant global entertainment platform with over 260M subscribers, replacing traditional cable bundles."
    }
  },
  {
    id: "amazon",
    company: "Amazon",
    tag: "E-Commerce & Cloud",
    tagClass: "bg-amber-50 text-amber-700 border-amber-200/60",
    svgClass: "text-amber-500",
    summary: "From online bookstore to digital ecosystem.",
    watermark: "ecosystem",
    detailedBrief: {
      headline: "Constructing the Ultimate Platform Ecosystem",
      strategicShift: "Evolution from a narrow retail merchant to a multi-sided marketplace platform and web infrastructure provider.",
      keyEnablers: [
        "Synergistic fly-wheel: low prices and wide selection attract customers, driving third-party merchant traffic.",
        "Amazon Web Services (AWS): Monetizing internal infrastructure capacity into a global utility computing giant.",
        "Prime membership program lock-in as a strategic consumer moat."
      ],
      outcome: "The world's most pervasive digital retail and computing ecosystem, generating over $570B in annual revenue."
    }
  },
  {
    id: "uber",
    company: "Uber",
    tag: "Mobility & Platform",
    tagClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    svgClass: "text-emerald-500",
    summary: "How platform business models transformed transportation.",
    watermark: "mobility",
    detailedBrief: {
      headline: "Disrupting Transit with Double-Sided Markets",
      strategicShift: "Replacing asset-heavy taxi services with an asset-light transaction matching platform.",
      keyEnablers: [
        "Real-time supply/demand matching via dynamic pricing algorithms.",
        "Low-friction consumer and driver application networks.",
        "Cross-network effects between ride-sharing, food delivery (Uber Eats), and freight."
      ],
      outcome: "Global mobility leader processing billions of trips annually, proving the viability of the sharing economy model."
    }
  },
  {
    id: "adobe",
    company: "Adobe",
    tag: "Software & SaaS",
    tagClass: "bg-blue-50 text-blue-700 border-blue-200/60",
    svgClass: "text-indigo-500",
    summary: "Transition from software licensing to SaaS subscriptions.",
    watermark: "creative",
    detailedBrief: {
      headline: "The Adobe Creative Suite SaaS Evolution",
      strategicShift: "Pioneering transition of creative desktop suites to the Creative Cloud subscription model.",
      keyEnablers: [
        "Shifting from $2,500 upfront desktop boxed licenses to low-barrier, high-LTV monthly subscriptions.",
        "Cloud file synchronization, asset collaboration, and cloud-native workflows.",
        "Constant incremental updates, eliminating long, multi-year product update cycles."
      ],
      outcome: "Consistent recurring revenue growth, high margin predictability, and massive customer acquisition expansion."
    }
  }
];

const getQuizDisplayTitle = (quiz: any, modules: any[] = []) => {
  const titleStr = String(quiz.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = quiz.module || (Array.isArray(modules) && modules.find((m: any) => m.id === quiz.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (quiz.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        let cleanSubTitle = subtopic.title.trim();
        const prefixRegex = new RegExp(`^(Quiz\\s+)?${titleStr.replace(".", "\\.")}[:\\s-]*|^(Quiz\\s+)?\\d+\\.\\d+[:\\s-]*`, 'i');
        cleanSubTitle = cleanSubTitle.replace(prefixRegex, "").trim();
        return `Quiz ${titleStr}: ${cleanSubTitle}`;
      }
    }
  }
  return quiz.title;
};

const getFlashcardDisplayTitle = (deck: any, modules: any[] = []) => {
  const titleStr = String(deck.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = deck.module || (Array.isArray(modules) && modules.find((m: any) => m.id === deck.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (deck.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        return subtopic.title;
      }
    }
  }
  return deck.title;
};

interface ResourceRowItemProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  count?: number;
  countLabel: string;
  href?: string;
  onClick?: () => void;
  themeKey?: string;
  t?: any;
}

function ResourceRowItem({ icon: Icon, title, description, count, countLabel, href, onClick, themeKey, t }: ResourceRowItemProps) {
  let iconWrapperClass = "";
  if (themeKey === "ui programming") {
    iconWrapperClass = "w-8 h-8 rounded-none bg-slate-50 border-2 border-black flex items-center justify-center text-[#ef4444] flex-shrink-0 group-hover:bg-[#ef4444] group-hover:text-white transition-colors";
  } else if (themeKey === "python programming") {
    iconWrapperClass = "w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[#3776AB] flex-shrink-0 group-hover:bg-[#3776AB] group-hover:text-white transition-colors";
  } else if (themeKey === "digital business") {
    iconWrapperClass = "w-8 h-8 rounded-lg bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] flex-shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors";
  } else {
    // startup engineering or default
    iconWrapperClass = "w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors";
  }

  const containerClass = themeKey === "ui programming"
    ? "bg-white hover:bg-slate-50 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(239,68,68,1)] hover:-translate-y-0.5 transition-all duration-150 rounded-none group cursor-pointer"
    : themeKey === "python programming"
      ? "bg-white hover:bg-slate-50/50 border border-slate-200 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 rounded group cursor-pointer"
      : `bg-white hover:bg-slate-50/80 border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 rounded-xl group cursor-pointer`;

  const content = (
    <div className={`flex items-center justify-between py-3.5 px-4 ${containerClass}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={iconWrapperClass}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-black font-extrabold uppercase text-xs tracking-wider truncate leading-tight transition-colors ${themeKey === 'python programming' ? 'font-mono' : ''} ${t?.titleHover || ''}`}>
            {title}
          </span>
          <span className={`text-[10px] truncate leading-relaxed ${
            themeKey === 'python programming' ? 'text-slate-500 font-mono' : 'text-zinc-655 font-bold'
          }`}>
            {description}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 pl-2">
        {count !== undefined && (
          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 ${
            themeKey === 'ui programming'
              ? 'bg-slate-100 border border-black text-zinc-700'
              : themeKey === 'python programming'
                ? 'bg-slate-100 border border-slate-200 text-slate-650 rounded'
                : 'bg-slate-100 text-slate-600 rounded-md'
          }`}>
            {count} {countLabel}
          </span>
        )}
        <ChevronRight className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
          themeKey === 'python programming' ? 'text-[#3776AB]' : 'text-black'
        }`} />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block outline-hidden focus-visible:ring-2 focus-visible:ring-black">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="w-full text-left outline-hidden focus-visible:ring-2 focus-visible:ring-black border-none bg-transparent p-0">
      {content}
    </button>
  );
}

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const { isAuthenticated, status: authStatus } = useSession();

  const [data, setData] = useState<any>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulationsCount, setSimulationsCount] = useState<number | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const [tickerX, setTickerX] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Executive Strategy Portal active. Quarterly targets prioritize Module 1 operational scalability. Proceed?" }
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValidatingPassword, setIsValidatingPassword] = useState(false);

  // Python Development Studio State
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "basics": true });
  const [fileCodes, setFileCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const topic of PYTHON_WORKSPACE_TOPICS) {
      for (const file of topic.files) {
        initial[file.name] = file.code;
      }
    }
    return initial;
  });
  const [activeFile, setActiveFile] = useState<{ name: string; folder: string; code: string }>({
    name: "hello_world.py",
    folder: "01 Basics",
    code: `# hello_world.py\nprint("Hello, World!")\nprint("Welcome to Python Programming!")\n`
  });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Process finished with exit code 0"
  ]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [editorActiveTab, setEditorActiveTab] = useState("hello_world.py");
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const particleKeywords = ["def", "class", "import", "lambda", "async", "return", "from", "yield", "try", "except", "await"];
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      word: particleKeywords[Math.floor(Math.random() * particleKeywords.length)],
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 15}s`,
      fontSize: `${11 + Math.random() * 5}px`
    }));
    setParticles(generated);
  }, []);

  const runCodeInTerminal = (fileName: string) => {
    if (isTerminalRunning) return;
    setIsTerminalRunning(true);
    setTerminalLogs([`$ python ${fileName}`]);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "[RUNNING] Initializing python interpreter...", `[COMPILE] Compiling ${fileName}...`]);
    }, 300);

    setTimeout(() => {
      let matchedFile: any = null;
      for (const topic of PYTHON_WORKSPACE_TOPICS) {
        for (const file of topic.files) {
          if (file.name === fileName && activeFile.code.trim() === file.code.trim()) {
            matchedFile = file;
            break;
          }
        }
      }

      let outputs: string[] = [];
      if (matchedFile) {
        outputs = matchedFile.output;
      } else {
        outputs = executePythonSim(activeFile.code);
      }

      setTerminalLogs(prev => [...prev, ...outputs]);
    }, 700);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "", "Process finished with exit code 0"]);
      setIsTerminalRunning(false);
    }, 1200);
  };

  useEffect(() => {
    if (authStatus === "loading") return;

    if (subjectId) {
      // Stale-While-Revalidate: Load from local cache immediately if available
      const cachedDashboard = localStorage.getItem(`cached_dashboard_${subjectId}`);
      const cachedSimsCount = localStorage.getItem(`cached_sims_count_${subjectId}`);
      if (cachedDashboard) {
        try {
          let parsed = JSON.parse(cachedDashboard);
          let hasKey = false;
          // If the cached dashboard is encrypted (e.g. cached before authorization),
          // decrypt it in-memory using the newly-acquired decryption keys.
          if (parsed && parsed.encrypted) {
            const key = localStorage.getItem(`subject_key_${subjectId}`);
            const expirationStr = localStorage.getItem(`subject_unlocked_expiry_${subjectId}`);
            if (key && expirationStr && Date.now() < parseInt(expirationStr, 10)) {
              const decrypted = decryptObject(parsed, key);
              if (decrypted) {
                parsed = decrypted;
                hasKey = true;
              }
            }
          } else {
            hasKey = true;
          }
          
          setData(parsed);
          if (cachedSimsCount !== null) {
            setSimulationsCount(parseInt(cachedSimsCount, 10));
          }
          if (hasKey || !isAuthenticated) {
            setLoading(false);
          }
        } catch (e) {
          console.error("Failed to parse cached dashboard data:", e);
        }
      }

      const loadDashboardData = async () => {
        try {
          const [result, sims] = await Promise.all([
            fetchGAS("getStudentDashboard", {
              userId: "anonymous",
              subjectId: subjectId
            }),
            fetchGAS("getSimulations", { subjectId }).catch(e => {
              console.warn("Failed to load simulations in dashboard", e);
              return [];
            })
          ]);

          let finalResult = result;
          let finalSims = sims;

          // If the fetched result is encrypted and the faculty is logged in, fetch keys and decrypt
          if (result && result.encrypted && isAuthenticated) {
            try {
              const keys = await fetchGAS("getEncryptionKeys");
              const dataKey = keys[subjectId];
              if (dataKey) {
                const expirationTime = Date.now() + 6 * 60 * 60 * 1000;
                localStorage.setItem(`subject_unlocked_expiry_${subjectId}`, expirationTime.toString());
                localStorage.setItem(`subject_key_${subjectId}`, dataKey);

                const decrypted = decryptObject(result, dataKey);
                if (decrypted) {
                  finalResult = decrypted;
                }
                if (sims && sims.encrypted) {
                  const decryptedSims = decryptObject(sims, dataKey);
                  if (decryptedSims) {
                    finalSims = decryptedSims;
                  }
                }
              }
            } catch (e) {
              console.error("Failed to auto-decrypt subject for logged in faculty:", e);
            }
          }

          setData(finalResult);
          localStorage.setItem(`cached_dashboard_${subjectId}`, JSON.stringify(finalResult));
          if (Array.isArray(finalSims)) {
            setSimulationsCount(finalSims.length);
            localStorage.setItem(`cached_sims_count_${subjectId}`, finalSims.length.toString());
          } else {
            setSimulationsCount(0);
            localStorage.setItem(`cached_sims_count_${subjectId}`, "0");
          }
        } catch (err) {
          console.error("Failed to load dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [subjectId, isAuthenticated, authStatus]);

  useEffect(() => {
    // Check if user is already unlocked for this subject
    if (data && data.subject) {
      if (data.subject.isPublic === "true" || data.subject.isPublic === true) {
        setIsLocked(false);
        return;
      }
      
      const expirationStr = localStorage.getItem(`subject_unlocked_expiry_${data.subject.id}`);
      if (expirationStr) {
        const expirationTime = parseInt(expirationStr, 10);
        if (Date.now() < expirationTime) {
          setIsLocked(false);
          return;
        } else {
          // Token expired, clear it
          localStorage.removeItem(`subject_unlocked_expiry_${data.subject.id}`);
        }
      }
      setIsLocked(true);
    } else if (data && data.encrypted) {
      // If the faculty is authenticated, wait for the background decrypt/loader, don't show lock screen yet
      if (isAuthenticated) {
        setIsLocked(false);
      } else {
        setIsLocked(true);
      }
    }
  }, [data, isAuthenticated]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isValidatingPassword) return;
    setIsValidatingPassword(true);
    setPasswordError("");
    try {
      const result = await fetchGAS("verifyStudentAccess", {
        subjectId: subjectId,
        credential: credentialResponse.credential,
      });
      if (result?.authorized) {
        const expirationTime = Date.now() + 6 * 60 * 60 * 1000;
        localStorage.setItem(`subject_unlocked_expiry_${subjectId}`, expirationTime.toString());
        if (result.dataKey) {
           localStorage.setItem(`subject_key_${subjectId}`, result.dataKey);
        }
        setIsLocked(false);
        setPasswordError("");
        window.location.reload();
      } else {
        setPasswordError(result?.error || "You are not authorized for this subject. Please contact faculty.");
      }
    } catch (err) {
      setPasswordError("Verification failed. Please try again.");
    } finally {
      setIsValidatingPassword(false);
    }
  };

  // Live horizontal trading ticker animation loop for Digital Business
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerX((prev) => (prev <= -1000 ? 0 : prev - 0.75));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <UttamLoader isLoading={true} />;
  }

  if (!data || (!data.subject && !data.encrypted)) {
    return (
      <div className="p-8 text-center text-[#F43F5E] font-bold border-4 border-[#F43F5E] bg-white max-w-xl mx-auto mt-20">
        CRITICAL FAILURE: INSTANCE CONNECT PATHWAY TERMINATED.
      </div>
    );
  }

  const isActuallyLocked = isLocked || (data && data.encrypted && !data.subject);

  if (isActuallyLocked) {
    if (isValidatingPassword) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center text-indigo-600 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Verifying Access...</h2>
            <p className="text-slate-500 text-sm animate-pulse">Communicating with authorization servers</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Protected Subject</CardTitle>
            <CardDescription className="text-slate-500">
              Please sign in with your authorized Google account to access this subject.<br/>
              <span className="font-semibold text-indigo-600 mt-2 inline-block">(Please use your Somaiya email ID)</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full flex justify-center py-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setPasswordError("Google login failed")}
              />
            </div>
            {passwordError && <p className="text-sm text-red-500 mt-4 text-center">{passwordError}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  let { subject, modules = [], quizzesWithAttempts = [], flashcardDecks = [], mindmaps = [], infographics = [], subjectResources = [] } = data;

  // Filter out invisible subtopics
  modules = modules.map((mod: any) => ({
    ...mod,
    subtopics: (mod.subtopics || []).filter((st: any) => st.isVisible !== false)
  }));

  const activeModule = modules.length > 0 ? modules[0] : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setAiInput("");

    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: "assistant",
        content: `Analyzing parameters for "${userMsg}". Recommended strategic vector: Maximize output structures across target key result zones.`
      }]);
    }, 800);
  };

  // Identify theme variants safely using lowercase checks
  const subjectNameLower = String(subject?.name || "").toLowerCase();
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || subjectNameLower.includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || subjectNameLower.includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || subjectNameLower.includes("python");
  const isStartupEngineering = subjectNameLower.includes("startup") || subjectNameLower.includes("engineering");

  const themeKey = isUiProgramming 
    ? "ui programming" 
    : (isStartupEngineering 
      ? "startup engineering" 
      : (isDigitalBusiness 
        ? "digital business" 
        : (subjectNameLower.includes("python") ? "python programming" : "")));
  const t = THEME_MAP[themeKey] || getDynamicTheme(subject?.id || subjectId);

  const targetModules = (isPythonProgramming && (!modules || modules.length === 0)) ? PYTHON_FALLBACK_MODULES : modules;

  const filteredModules = targetModules.filter((mod: any) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      String(mod.title || "").toLowerCase().includes(query) ||
      String(mod.description || "").toLowerCase().includes(query) ||
      (mod.subtopics || []).some((st: any) => String(st.title || "").toLowerCase().includes(query))
    );
  });

  const notesCount = targetModules.length;
  const mindmapsCount = mindmaps.length;
  const infographicsCount = infographics.length;
  const flashcardsCount = flashcardDecks.length;
  const quizzesCount = quizzesWithAttempts.length;
  const pdfCount = subjectResources.length;

  // Count video subtopics
  const videosCount = targetModules.reduce((acc: number, mod: any) => 
    acc + (mod.subtopics || []).filter((st: any) => !!st.videoUrl || st.type === "videoUrl" || st.selectedResourceType === "videoUrl").length, 0
  );

  // Count audio subtopics
  const audiosCount = targetModules.reduce((acc: number, mod: any) => 
    acc + (mod.subtopics || []).filter((st: any) => !!st.audioUrl || st.type === "audioUrl" || st.selectedResourceType === "audioUrl").length, 0
  );

  const actualSimulationsCount = simulationsCount ?? 0;

  return (
    <div className={`min-h-screen ${t.bg} ${t.pattern} pb-24 relative overflow-hidden antialiased selection:bg-[#4f46e5]/10 selection:text-[#4f46e5]`}>
      {/* Top thick accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isUiProgramming
          ? 'bg-black'
          : isPythonProgramming
            ? 'bg-[#3776AB]'
            : isDigitalBusiness
              ? 'bg-[#0F766E]'
              : 'bg-blue-600'
      }`} />
      
      {/* Background decoration */}
      {isUiProgramming && <FloatingBackground />}
      
      {/* Python Matrix/Terminal custom background particles */}
      {isPythonProgramming && particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.fontSize,
            opacity: 0.08
          }}
        >
          {p.word}
        </span>
      ))}

      {/* Global CSS style definitions */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
        
        .font-jetbrains {
          font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
        }
        .strategy-board-dot {
          background-image: radial-gradient(#e2e8f0 1.2px, transparent 1.2px);
          background-size: 24px 24px;
        }
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.08;
          }
          90% {
            opacity: 0.08;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }
        .particle {
          position: absolute;
          animation: float-up 25s linear infinite;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          font-weight: bold;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="container mx-auto px-4 mt-8 relative z-10 max-w-6xl space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold" aria-label="Breadcrumb">
          <Link href="/student/subjects" className={`hover:underline transition-all ${t.titleHover}`}>
            Subjects
          </Link>
          <span className="text-zinc-400">/</span>
          <span className={`uppercase tracking-wider font-extrabold ${isPythonProgramming ? 'text-[#3776AB]' : 'text-black'}`}>{subject.name}</span>
        </nav>

        {/* 1. SUBJECT HEADER */}
        <header className={`relative ${t.cardBg} ${t.borderClass} ${t.shadowClass} p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
          <div className="space-y-4 flex-1 w-full">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-mono tracking-widest font-black px-2.5 py-1 ${t.badge}`}>
                Subject Workspace
              </span>
            </div>
            <h1 className={`text-3xl font-black uppercase tracking-tight leading-none ${isPythonProgramming ? 'text-slate-900 font-jetbrains' : 'text-slate-900 font-sans'}`}>
              {subject.name}
            </h1>
            <p className={`text-sm font-bold max-w-2xl leading-relaxed ${isPythonProgramming ? 'text-slate-600 font-mono' : 'text-zinc-700 font-sans'}`}>
              {subject.description || "Explore and master the conceptual foundations, modules, quizzes, and simulation runtimes of this subject."}
            </p>

            {/* Statistics Panel */}
            <div className="flex flex-wrap gap-4 pt-2">
              <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 ${
                isUiProgramming
                  ? 'bg-slate-100 text-zinc-800 border-2 border-black'
                  : isPythonProgramming
                    ? 'bg-white text-slate-700 border border-slate-200 rounded'
                    : 'bg-slate-100 text-zinc-800 border border-slate-200 rounded-md'
              }`}>
                📚 {notesCount} Modules
              </span>
              <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 ${
                isUiProgramming
                  ? 'bg-slate-100 text-zinc-800 border-2 border-black'
                  : isPythonProgramming
                    ? 'bg-white text-slate-700 border border-slate-200 rounded'
                    : 'bg-slate-100 text-zinc-800 border border-slate-200 rounded-md'
              }`}>
                🎥 {videosCount} Videos
              </span>
              <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 ${
                isUiProgramming
                  ? 'bg-slate-100 text-zinc-800 border-2 border-black'
                  : isPythonProgramming
                    ? 'bg-white text-slate-700 border border-slate-200 rounded'
                    : 'bg-slate-100 text-zinc-800 border border-slate-200 rounded-md'
              }`}>
                🎮 {actualSimulationsCount} Simulations
              </span>
              <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 ${
                isUiProgramming
                  ? 'bg-slate-100 text-zinc-800 border-2 border-black'
                  : isPythonProgramming
                    ? 'bg-white text-slate-700 border border-slate-200 rounded'
                    : 'bg-slate-100 text-zinc-800 border border-slate-200 rounded-md'
              }`}>
                📄 {pdfCount} Resources
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full pt-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550" />
              <input
                type="text"
                placeholder="Search modules or subtopics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs text-black focus:outline-hidden transition-all font-bold ${
                  isUiProgramming
                    ? 'bg-[#FAF9F5] border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_rgba(239,68,68,1)] focus:-translate-x-0.5 focus:-translate-y-0.5'
                    : isPythonProgramming
                      ? 'bg-white border border-slate-200 rounded shadow-xs focus:border-[#3776AB] focus:ring-1 focus:ring-[#3776AB] font-mono'
                      : 'bg-white border border-slate-200 rounded-xl shadow-xs focus:ring-2 focus:ring-[#0F766E] font-sans'
                }`}
              />
            </div>
          </div>
        </header>

        {/* 2. MODULE LIBRARY */}
        <section className="space-y-6">
          <div className={`border-b-4 pb-3 ${isUiProgramming ? 'border-black' : isPythonProgramming ? 'border-[#3776AB]/30' : 'border-slate-200'}`}>
            <h2 className={`text-xl font-black uppercase tracking-tight ${isPythonProgramming ? 'font-mono' : 'font-sans'}`}>
              Module Library
            </h2>
            <p className={`text-xs font-bold mt-1 ${isPythonProgramming ? 'text-slate-500 font-mono' : 'text-zinc-655'}`}>
              Explore the primary learning structure of this course
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((mod: any, index: number) => {
              const totalTopics = mod.subtopics?.length || 0;
              return (
                <article 
                  key={mod.id || index} 
                  className={`p-4 md:p-5 flex flex-col justify-between group transition-all duration-200 ${t.cardBg} ${t.borderClass} ${t.shadowClass}`}
                >
                  <div className="space-y-3">
                    {/* Top Header Row: Badge + Hours & Topics */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 ${
                        isUiProgramming
                          ? 'text-white bg-zinc-900 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                          : isPythonProgramming
                            ? 'text-white bg-[#3776AB] border border-[#3776AB] rounded'
                            : 'text-slate-700 bg-slate-100 border border-slate-200 rounded-md'
                      }`}>
                        Module {mod.moduleNo < 10 ? `0${mod.moduleNo}` : mod.moduleNo}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-mono font-bold flex items-center gap-1 ${isPythonProgramming ? 'text-slate-550' : 'text-zinc-600'}`}>
                          <Clock className={`w-3.5 h-3.5 ${isPythonProgramming ? 'text-[#3776AB]' : 'text-zinc-450'}`} /> {mod.hours || 4} Hrs
                        </span>
                        <span className={`text-[11px] font-mono font-bold flex items-center gap-1 ${isPythonProgramming ? 'text-slate-555' : 'text-zinc-600'}`}>
                          <BookOpen className={`w-3.5 h-3.5 ${isPythonProgramming ? 'text-[#3776AB]' : 'text-zinc-450'}`} /> {totalTopics} Topics
                        </span>
                      </div>
                    </div>

                    {/* Module Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight leading-snug transition-colors ${t.titleHover}`}>
                        {mod.title ? mod.title.replace(/^[●•]\s*/, "") : `Module ${mod.moduleNo}`}
                      </h3>
                      {mod.description && (
                        <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${isPythonProgramming ? 'text-slate-500' : 'text-zinc-600'}`}>
                          {mod.description}
                        </p>
                      )}
                    </div>

                    {/* Topics Included Preview */}
                    {mod.subtopics && mod.subtopics.length > 0 && (
                      <div className={`pt-2.5 border-t space-y-1 ${isPythonProgramming ? 'border-[#3776AB]/20' : 'border-zinc-300/70'}`}>
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold block ${isPythonProgramming ? 'text-[#3776AB]' : 'text-zinc-500'}`}>
                          Topics Included
                        </span>
                        <ul className="space-y-1">
                          {mod.subtopics.slice(0, 3).map((sub: any, sIdx: number) => {
                            const titleStr = sub.title ? sub.title.replace(/^[●•]\s*/, "") : sub.name || `Topic ${sIdx + 1}`;
                            return (
                              <li key={sIdx} className={`text-xs font-semibold flex items-center gap-1.5 truncate ${isPythonProgramming ? 'text-slate-700' : 'text-zinc-800'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isUiProgramming ? 'bg-[#EF4444]' : isPythonProgramming ? 'bg-[#3776AB]' : isDigitalBusiness ? 'bg-[#0F766E]' : 'bg-blue-600'}`} />
                                <span className="truncate">{titleStr}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Bottom CTA Row */}
                  <div className={`pt-3.5 mt-3 border-t flex items-center justify-between ${isPythonProgramming ? 'border-[#3776AB]/20' : 'border-zinc-300/70'}`}>
                    <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                      Module {mod.moduleNo < 10 ? `0${mod.moduleNo}` : mod.moduleNo}
                    </span>
                    <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                      <button className={t.btnPrimary + " inline-flex items-center gap-1.5 cursor-pointer group/btn"}>
                        <span>Open Module</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </article>
              );
            })}
            {filteredModules.length === 0 && (
              <div className={`col-span-1 md:col-span-2 text-center py-12 border-4 border-dashed border-zinc-350 bg-white ${isUiProgramming ? 'shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'rounded-xl shadow-xs'}`}>
                <Info className="w-8 h-8 mx-auto text-zinc-400" />
                <p className="text-sm font-bold text-zinc-700 mt-2">No matching modules found in this subject.</p>
              </div>
            )}
          </div>
        </section>

        {/* Secondary Resource Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          
          {/* 3. RESOURCES SECTION */}
          <section className="space-y-4">
            <div className={`border-b-4 pb-2 ${isUiProgramming ? 'border-black' : isPythonProgramming ? 'border-[#3776AB]/30' : 'border-slate-200'}`}>
              <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isPythonProgramming ? 'text-[#3776AB]' : 'text-black'}`}>
                <FolderOpen className="w-4 h-4" />
                Resources
              </h2>
            </div>
            <div className="space-y-3">
              <ResourceRowItem 
                icon={BookOpen}
                title="Notes"
                description="Lecture notes & explanations"
                count={notesCount}
                countLabel="Modules"
                href={`/student/subjects/subject/notes?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={Play}
                title="Videos"
                description="Recorded video walkthroughs"
                count={videosCount}
                countLabel="Videos"
                href={`/student/subjects/subject/videos?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={FileText}
                title="PDF Resources"
                description="Reference manuals & slides"
                count={pdfCount}
                countLabel="Files"
                href={`/student/subjects/subject/pdfs?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={Headphones}
                title="Audio Lessons"
                description="Audio explanations & lectures"
                count={audiosCount}
                countLabel="Audios"
                href={`/student/subjects/subject/audio?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
            </div>
          </section>

          {/* 4. PRACTICE SECTION */}
          <section className="space-y-4">
            <div className={`border-b-4 pb-2 ${isUiProgramming ? 'border-black' : isPythonProgramming ? 'border-[#3776AB]/30' : 'border-slate-200'}`}>
              <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isPythonProgramming ? 'text-[#3776AB]' : 'text-black'}`}>
                <Award className="w-4 h-4" />
                Practice
              </h2>
            </div>
            <div className="space-y-3">
              <ResourceRowItem 
                icon={Zap}
                title="Flashcards"
                description="Active recall flashcard decks"
                count={flashcardsCount}
                countLabel="Decks"
                href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={CheckCircle}
                title="Quizzes"
                description="Adaptive subject assessments"
                count={quizzesCount}
                countLabel="Quizzes"
                href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={Gamepad2}
                title="Simulations"
                description="Interactive sandbox exercises"
                count={actualSimulationsCount}
                countLabel="Sims"
                href={`/student/subjects/subject/simulations?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
            </div>
          </section>

          {/* 5. VISUAL LEARNING SECTION */}
          <section className="space-y-4">
            <div className={`border-b-4 pb-2 ${isUiProgramming ? 'border-black' : isPythonProgramming ? 'border-[#3776AB]/30' : 'border-slate-200'}`}>
              <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isPythonProgramming ? 'text-[#3776AB]' : 'text-black'}`}>
                <Brain className="w-4 h-4" />
                Visual Learning
              </h2>
            </div>
            <div className="space-y-3">
              <ResourceRowItem 
                icon={Terminal}
                title="Mind Maps"
                description="Visual concept layout topologies"
                count={mindmapsCount}
                countLabel="Maps"
                href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
              <ResourceRowItem 
                icon={Presentation}
                title="Infographics"
                description="Design grids & visual guidelines"
                count={infographicsCount}
                countLabel="Graphics"
                href={`/student/subjects/subject/infographics?subjectId=${subjectId}`}
                themeKey={themeKey}
                t={t}
              />
            </div>
          </section>

        </div>

        {/* PDF Dialog Modal */}
        {pdfModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
          >
            <div className={`p-6 md:p-8 max-w-lg w-full relative animate-in fade-in zoom-in-95 duration-150 ${
              isUiProgramming
                ? 'bg-[#FAF9F5] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-none'
                : isPythonProgramming
                  ? 'bg-white border-2 border-slate-200 rounded shadow-lg'
                  : 'bg-white border border-slate-200 rounded-xl shadow-xl'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 id="pdf-modal-title" className={`text-xl font-black uppercase tracking-tight flex items-center gap-2 ${
                    isPythonProgramming ? 'font-mono text-[#3776AB]' : 'text-black'
                  }`}>
                    <FileText className="w-5 h-5" />
                    PDF Resources
                  </h2>
                  <p className={`text-xs font-bold mt-1 ${isPythonProgramming ? 'text-slate-550 font-mono' : 'text-zinc-650'}`}>
                    Select a textbook or reading manual to view in Google Drive
                  </p>
                </div>
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className={`cursor-pointer outline-hidden ${
                    isUiProgramming
                      ? 'text-black hover:text-red-500 font-mono font-black text-sm border-2 border-black bg-white hover:bg-slate-50 px-2 py-0.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]'
                      : isPythonProgramming
                        ? 'text-slate-550 hover:text-slate-800 font-mono text-xs border border-slate-200 px-2 py-1 rounded bg-slate-50'
                        : 'text-slate-400 hover:text-slate-655 hover:bg-slate-100 rounded-lg p-1.5'
                  }`}
                  aria-label="Close dialog"
                >
                  ESC
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {subjectResources.map((resource: any, index: number) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3.5 transition-all duration-150 group outline-hidden ${
                      isUiProgramming
                        ? 'bg-white hover:bg-indigo-50/50 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(79,70,229,1)] hover:-translate-y-0.5 text-slate-800'
                        : isPythonProgramming
                          ? 'bg-white hover:bg-slate-50/80 border border-slate-200 rounded shadow-xs text-slate-850 hover:border-[#3776AB]'
                          : 'bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs text-slate-800 hover:border-[#0F766E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isUiProgramming
                          ? 'bg-indigo-50 border border-black text-[#4f46e5] group-hover:bg-[#4f46e5] group-hover:text-white'
                          : isPythonProgramming
                            ? 'bg-blue-50 border border-slate-200 text-[#3776AB] rounded'
                            : 'bg-emerald-50 text-[#0F766E] rounded-lg'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-extrabold uppercase tracking-wide truncate ${isPythonProgramming ? 'font-mono' : ''}`}>
                        {resource.title}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-black flex-shrink-0" />
                  </a>
                ))}
                {subjectResources.length === 0 && (
                  <div className="text-center py-6 text-xs text-zinc-550 border-2 border-dashed border-zinc-200">
                    No PDF resources uploaded yet.
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className={`cursor-pointer ${t.btnPrimary}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
