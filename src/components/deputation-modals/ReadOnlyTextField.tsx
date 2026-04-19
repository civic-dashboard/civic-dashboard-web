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
      <label className="font-bold block w-1/2" htmlFor={id}>
        {label}
      </label>
      <Input
        className="border-none h-auto p-0"
        id={id}
        value={value}
        type="text"
        readOnly
      />
    </fieldset>
  );
}
