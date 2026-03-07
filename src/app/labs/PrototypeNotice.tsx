import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export const PrototypeNotice = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex flex-col items-end space-y-4 w-full px-8 pt-4">
      <Accordion
        type="multiple"
        defaultValue={['prototype']}
        className="w-full"
      >
        <AccordionItem value="prototype">
          <AccordionTrigger className="text-orange-500">
            Prototype Notice
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-muted-foreground text-orange-500">
              {children}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
