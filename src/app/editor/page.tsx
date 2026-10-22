import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function EditorIndexPage() {
  redirect(`/editor/blank-${randomUUID()}`);
}
