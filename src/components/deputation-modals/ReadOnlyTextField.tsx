import { Input } from '@/components/ui/input';

export function ReadonlyTextField({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value: string;
}) {
  return (
    <fieldset className="flex flex-col md:flex-row mb-2">
      <label className="block w-1/2 text-sm" htmlFor={id}>
        {label}
      </label>
      <Input
        className="border-none h-auto p-0 text-sm font-semibold"
        id={id}
        value={value}
        type="text"
        readOnly
      />
    </fieldset>
  );
}
