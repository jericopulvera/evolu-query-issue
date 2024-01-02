import useTodos from "@/states/useTodos";
import {
  SqliteBoolean,
  useEvolu,
  NonEmptyString1000,
  useOwner,
  parseMnemonic,
  canUseDom,
} from "@evolu/react";
import { Database, String5000 } from "@/states/evolu";
import { parseSync } from "@effect/schema/Schema";
import { TreeFormatter } from "@effect/schema";
import * as S from "@effect/schema/Schema";
import { Effect, Exit } from "effect";

export default function Home() {
  const { row: todo } = useTodos();
  console.log({ todo });
  const { create, restoreOwner, resetOwner } = useEvolu<Database>();
  const owner = useOwner();

  const isRestoringOwner = (isRestoringOwner?: boolean): boolean => {
    if (!canUseDom) return false;
    const key = 'evolu:isRestoringOwner"';
    if (isRestoringOwner != null)
      localStorage.setItem(key, isRestoringOwner.toString());
    return localStorage.getItem(key) === "true";
  };

  const handleRestoreOwnerClick = (): void => {
    prompt(NonEmptyString1000, "Your Mnemonic", (mnemonic) => {
        parseMnemonic(mnemonic)
          .pipe(Effect.runPromiseExit)
          .then(
            Exit.match({
              onFailure: (error) => {
                alert(JSON.stringify(error, null, 2));
              },
              onSuccess: (mnemonic) => {
                isRestoringOwner(true);
                restoreOwner(mnemonic);
              },
            })
          );
      });
  };

  const handleResetOwnerClick = (): void => {
    if (confirm("Are you sure? It will delete all your local data.")) {
      isRestoringOwner(false);
      resetOwner();
    }
  };

  if (todo)
    return (
      <div>
        <h1>MAIN SCREEN</h1>
        <h2>Mnemonic</h2>
        <div>{owner?.mnemonic}</div>
        <br />
        <button onClick={handleRestoreOwnerClick}>Restore Owner</button>
        <button onClick={handleResetOwnerClick}>Reset Owner</button>
      </div>
    );

  return (
    <div>
      <h1>ONBOARDING SCREEN</h1>
      <button
        onClick={() => {
          create("todo", {
            name: parseSync(NonEmptyString1000)(Date.now().toString()),
            description: parseSync(String5000)(Date.now().toString()),
            done: parseSync(SqliteBoolean)(1),
          });
        }}
      >
        Create Todo
      </button>
    </div>
  );
}

const prompt = <From extends string, To>(
  schema: S.Schema<From, To>,
  message: string,
  onSuccess: (value: To) => void
): void => {
  const value = window.prompt(message);
  if (value == null) return; // on cancel
  const a = S.parseEither(schema)(value);
  if (a._tag === "Left") {
    alert(TreeFormatter.formatErrors(a.left.errors));
    return;
  }
  onSuccess(a.right);
};
