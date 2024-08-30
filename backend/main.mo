import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Result "mo:base/Result";

actor {
  public type Task = {
    id: Nat;
    text: Text;
    completed: Bool;
    icon: Text;
  };

  stable var tasks: [Task] = [
    { id = 1; text = "Brush teeth"; completed = false; icon = "🦷" },
    { id = 2; text = "Make bed"; completed = false; icon = "🛏️" },
    { id = 3; text = "Get dressed"; completed = false; icon = "👕" },
    { id = 4; text = "Eat breakfast"; completed = false; icon = "🥣" },
    { id = 5; text = "Pack backpack"; completed = false; icon = "🎒" },
    { id = 6; text = "Clean up dog poop"; completed = false; icon = "💩" }
  ];
  stable var taskIdCounter: Nat = 6;

  public query func getTasks(): async [Task] {
    tasks
  };

  public func addTask(text: Text, icon: Text): async Result.Result<Task, Text> {
    taskIdCounter += 1;
    let newTask: Task = {
      id = taskIdCounter;
      text = text;
      completed = false;
      icon = icon;
    };
    tasks := Array.append(tasks, [newTask]);
    #ok(newTask)
  };

  public func toggleTask(id: Nat): async Result.Result<Task, Text> {
    let taskIndex = Array.indexOf<Task>({ id = id; text = ""; completed = false; icon = "" }, tasks, func(a, b) { a.id == b.id });
    switch (taskIndex) {
      case null { #err("Task not found") };
      case (?index) {
        let updatedTask = {
          id = tasks[index].id;
          text = tasks[index].text;
          completed = not tasks[index].completed;
          icon = tasks[index].icon;
        };
        tasks := Array.mapEntries<Task, Task>(tasks, func(task, i) {
          if (i == index) { updatedTask } else { task }
        });
        #ok(updatedTask)
      };
    }
  };

  public query func getProgress(): async { completed: Nat; total: Nat } {
    let completed = Array.filter<Task>(tasks, func(task) { task.completed }).size();
    { completed = completed; total = tasks.size() }
  };
}
