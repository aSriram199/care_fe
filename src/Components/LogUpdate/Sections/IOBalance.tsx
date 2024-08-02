import { Fragment } from "react/jsx-runtime";
import { DailyRoundsModel, NameQuantity } from "../../Patient/models";
import SelectMenuV2 from "../../Form/SelectMenuV2";
import TextFormField from "../../Form/FormFields/TextFormField";
import ButtonV2 from "../../Common/components/ButtonV2";
import CareIcon from "../../../CAREUI/icons/CareIcon";
import { LogUpdateSectionMeta, LogUpdateSectionProps } from "../utils";

const sections = [
  {
    name: "Intake",
    fields: [
      {
        name: "Infusions",
        options: [
          "Adrenalin",
          "Nor-adrenalin",
          "Vasopressin",
          "Dopamine",
          "Dobutamine",
        ],
        key: "infusions",
      },
      {
        name: "IV Fluids",
        options: ["RL", "NS", "DNS"],
        key: "iv_fluids",
      },
      {
        name: "Feed",
        options: ["Ryles Tube", "Normal Feed"],
        key: "feeds",
      },
    ],
  },
  {
    name: "Outturn",
    fields: [
      {
        name: "Output",
        options: ["Urine", "Rules Tube Aspiration", "ICD"],
        key: "output",
      },
    ],
  },
] satisfies {
  name: string;
  fields: {
    name: string;
    options: string[];
    key: keyof DailyRoundsModel;
  }[];
}[];

const IOBalance = ({ log, onChange }: LogUpdateSectionProps) => {
  return (
    <div className="flex flex-col gap-8">
      {sections.map(({ name, fields }, k) => (
        <Fragment key={k}>
          <h3 className="font-black">{name}</h3>
          {fields.map((field, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h4>{field.name}</h4>
              {(log[field.key] as NameQuantity[] | undefined)?.map(
                ({ name, quantity }, j) => (
                  <div key={j} className="flex items-end gap-4">
                    <div className="flex-1">
                      {j == 0 && (
                        <div className="mb-2 text-sm text-secondary-800">
                          Type
                        </div>
                      )}
                      <SelectMenuV2
                        options={field.options
                          .filter(
                            (option) =>
                              !(log[field.key] as NameQuantity[] | undefined)
                                ?.map((f) => f.name)
                                .includes(option),
                          )
                          .concat(field.options.includes(name) ? [name] : [])}
                        optionLabel={(f) => f}
                        value={name}
                        onChange={(val) =>
                          onChange({
                            [field.key]: (
                              log[field.key] as NameQuantity[] | undefined
                            )?.map((f, fi) =>
                              j === fi ? { ...f, name: val } : f,
                            ),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                    <TextFormField
                      type="number"
                      name={name + " Quantity"}
                      compact
                      value={quantity.toString()}
                      onChange={(val) =>
                        onChange({
                          [field.key]: (
                            log[field.key] as NameQuantity[] | undefined
                          )?.map((f, fi) =>
                            j === fi
                              ? { ...f, quantity: parseInt(val.value) }
                              : f,
                          ),
                        })
                      }
                      label={
                        j == 0 && (
                          <div className="text-sm text-secondary-800">
                            Quantity
                          </div>
                        )
                      }
                    />
                    <ButtonV2
                      variant="secondary"
                      className="text-lg text-red-500"
                      onClick={() =>
                        onChange({
                          [field.key]: (
                            log[field.key] as NameQuantity[] | undefined
                          )?.filter((f, fi) => j !== fi),
                        })
                      }
                    >
                      <CareIcon icon="l-trash" />
                    </ButtonV2>
                  </div>
                ),
              )}
              <ButtonV2
                variant="secondary"
                className="bg-secondary-200"
                onClick={() =>
                  onChange({
                    [field.key]: [
                      ...((log[field.key] as NameQuantity[] | undefined) || []),
                      { name: null, quantity: 0 },
                    ],
                  })
                }
                disabled={
                  field.options.length ===
                  (log[field.key] as NameQuantity[] | undefined)?.length
                }
              >
                <CareIcon icon="l-plus" />
                Add {field.name}
              </ButtonV2>
            </div>
          ))}
          <div className="flex items-center justify-between border-b-2 border-b-secondary-400 pb-2">
            <h4>Total</h4>
            <div>
              {fields
                .flatMap((f) =>
                  ((log[f.key] as NameQuantity[]) || []).map((f) => f.quantity),
                )
                .join("+")}
              =
              <span className="text-3xl font-black text-primary-500">
                {fields
                  .flatMap((f) =>
                    ((log[f.key] as NameQuantity[]) || []).map(
                      (f) => f.quantity,
                    ),
                  )
                  .reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>
        </Fragment>
      ))}
      <div className="flex items-center justify-between">
        <h4>I/O Balance</h4>
        <div>
          {sections
            .map((s) =>
              s.fields
                .flatMap((f) =>
                  ((log[f.key] as NameQuantity[]) || []).map((f) => f.quantity),
                )
                .reduce((a, b) => a + b, 0),
            )
            .join("-")}
          =
          <span className="text-3xl font-black text-primary-500">
            {sections
              .map((s) =>
                s.fields
                  .flatMap((f) =>
                    ((log[f.key] as NameQuantity[]) || []).map(
                      (f) => f.quantity,
                    ),
                  )
                  .reduce((a, b) => a + b, 0),
              )
              .reduce((a, b) => a - b)}
          </span>
        </div>
      </div>
    </div>
  );
};

IOBalance.meta = {
  title: "I/O Balance",
  icon: "l-balance-scale",
} as const satisfies LogUpdateSectionMeta;

export default IOBalance;
