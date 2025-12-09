import React from 'react';
import {
  Boxes,
  Link,
  Hash,
  Repeat,
  ArrowLeftRight,
  Search,
  Database,
  Layers,
  List,
  TreePine,
  BinaryIcon as BinaryTree,
  GitGraph,
  Shuffle,
  Network
} from "lucide-react"

export const categories = [
  "Basic",
  "Two Pointers",
  "Sliding Window",
  "Matrix",
  "Intervals",
  "Implementation",
  "Pattern Matching",
  "Mathematical",
  "Bit Manipulation",
  "Sorting",
  "Searching"
]

export const topicsData = {
  arrays: {
    icon: React.createElement(Boxes, { size: 40 }),
    title: "Arrays",
    description: "Master array manipulation and algorithms",
    color: "bg-blue-500",
    questions: [
      {
        status: false,
        problem: "Two Sum",
        practice: "https://leetcode.com/problems/two-sum/",
        difficulty: "Easy",
        category: "Basic",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      }
    ]
  },
  linkedList: {
    icon: React.createElement(Link, { size: 40 }),
    title: "Linked Lists",
    description: "Master singly and doubly linked lists",
    color: "bg-indigo-500",
    questions: [
      {
        status: false,
        problem: "Reverse Linked List",
        practice: "https://leetcode.com/problems/reverse-linked-list/",
        difficulty: "Easy",
        category: "Basic",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      }
    ]
  },
  strings: {
    icon: React.createElement(Hash, { size: 40 }),
    title: "Strings",
    description: "Learn string manipulation techniques",
    color: "bg-green-500",
    questions: []
  },
  recursion: {
    icon: React.createElement(Repeat, { size: 40 }),
    title: "Recursion",
    description: "Master recursive problem-solving",
    color: "bg-yellow-500",
    questions: []
  },
  backtracking: {
    icon: React.createElement(ArrowLeftRight, { size: 40 }),
    title: "Backtracking",
    description: "Learn backtracking algorithms",
    color: "bg-orange-500",
    questions: []
  },
  binarySearch: {
    icon: React.createElement(Search, { size: 40 }),
    title: "Binary Search",
    description: "Master divide and conquer",
    color: "bg-purple-500",
    questions: []
  },
  heaps: {
    icon: React.createElement(Database, { size: 40 }),
    title: "Heaps",
    description: "Priority queues and heap operations",
    color: "bg-pink-500",
    questions: []
  },
  stacks: {
    icon: React.createElement(Layers, { size: 40 }),
    title: "Stacks",
    description: "LIFO data structure problems",
    color: "bg-red-500",
    questions: []
  },
  queues: {
    icon: React.createElement(List, { size: 40 }),
    title: "Queues",
    description: "FIFO data structure problems",
    color: "bg-teal-500",
    questions: []
  },
  binaryTree: {
    icon: React.createElement(TreePine, { size: 40 }),
    title: "Binary Trees",
    description: "Tree traversal and operations",
    color: "bg-emerald-500",
    questions: []
  },
  bst: {
    icon: React.createElement(BinaryTree, { size: 40 }),
    title: "Binary Search Trees",
    description: "BST operations and balancing",
    color: "bg-cyan-500",
    questions: []
  },
  dp: {
    icon: React.createElement(GitGraph, { size: 40 }),
    title: "Dynamic Programming",
    description: "Master DP concepts and patterns",
    color: "bg-violet-500",
    questions: []
  },
  greedy: {
    icon: React.createElement(Shuffle, { size: 40 }),
    title: "Greedy Algorithms",
    description: "Optimize with greedy approach",
    color: "bg-rose-500",
    questions: []
  },
  graphs: {
    icon: React.createElement(Network, { size: 40 }),
    title: "Graphs",
    description: "Learn graph algorithms and traversals",
    color: "bg-amber-500",
    questions: []
  }
}
