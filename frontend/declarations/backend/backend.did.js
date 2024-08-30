export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'icon' : IDL.Text,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  const Result = IDL.Variant({ 'ok' : Task, 'err' : IDL.Text });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getProgress' : IDL.Func(
        [],
        [IDL.Record({ 'total' : IDL.Nat, 'completed' : IDL.Nat })],
        ['query'],
      ),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'toggleTask' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
