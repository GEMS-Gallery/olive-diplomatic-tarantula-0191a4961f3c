import Bool "mo:base/Bool";
import Int "mo:base/Int";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import IC "mo:ic";

actor {
  public type Task = {
    id: Nat;
    text: Text;
    completed: Bool;
    icon: Text;
    reward: Nat;
  };

  stable var tasks: [Task] = [
    { id = 1; text = "Set up Internet Identity"; completed = false; icon = "🔑"; reward = 1 },
    { id = 2; text = "Create an app on GEMS"; completed = false; icon = "💎"; reward = 2 },
    { id = 3; text = "Deploy a canister"; completed = false; icon = "🚀"; reward = 3 },
    { id = 4; text = "Interact with a canister using Candid UI"; completed = false; icon = "🖥️"; reward = 2 },
    { id = 5; text = "Implement basic token functionality"; completed = false; icon = "💰"; reward = 4 },
    { id = 6; text = "Create a decentralized frontend"; completed = false; icon = "🌐"; reward = 5 }
  ];
  stable var taskIdCounter: Nat = 6;

  public shared(msg) func getTasks(): async [Task] {
    tasks
  };

  public shared(msg) func addTask(text: Text, icon: Text, reward: Nat): async Result.Result<Task, Text> {
    taskIdCounter += 1;
    let newTask: Task = {
      id = taskIdCounter;
      text = text;
      completed = false;
      icon = icon;
      reward = reward;
    };
    tasks := Array.append(tasks, [newTask]);
    #ok(newTask)
  };

  public shared(msg) func completeTask(id: Nat): async Result.Result<Task, Text> {
    let taskIndex = Array.indexOf<Task>({ id = id; text = ""; completed = false; icon = ""; reward = 0 }, tasks, func(a, b) { a.id == b.id });
    switch (taskIndex) {
      case null { #err("Task not found") };
      case (?index) {
        let task = tasks[index];
        if (task.completed) {
          return #err("Task already completed");
        };
        let updatedTask = {
          id = task.id;
          text = task.text;
          completed = true;
          icon = task.icon;
          reward = task.reward;
        };
        tasks := Array.mapEntries<Task, Task>(tasks, func(t, i) {
          if (i == index) { updatedTask } else { t }
        });
        await sendReward(msg.caller, task.reward);
        #ok(updatedTask)
      };
    }
  };

  public query func getProgress(): async { completed: Nat; total: Nat } {
    let completed = Array.filter<Task>(tasks, func(task) { task.completed }).size();
    { completed = completed; total = tasks.size() }
  };

  private func sendReward(user: Principal, amount: Nat): async () {
    let ledger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai") : actor {
      transfer : shared {to: Principal; amount: Nat} -> async Result.Result<Nat, Text>;
    };
    ignore await ledger.transfer({ to = user; amount = amount });
  };
}
