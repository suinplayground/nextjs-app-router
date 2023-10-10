"use client";

import { Switch } from "@nextui-org/switch";
import { useState } from "react";
import { Form } from "./form";

export default function Wrapper() {
  const [clientSideValidationEnabled, setClientSideValidationEnabled] =
    useState(false);

  return (
    <div className="flex flex-col gap-unit-md">
      <div className="border-1 p-unit-md">
        <div className="font-bold text-lg mb-unit-sm">Preferences</div>
        <div className="flex flex-wrap gap-unit-sm">
          <Switch
            isSelected={clientSideValidationEnabled}
            onValueChange={(value) => setClientSideValidationEnabled(value)}
          >
            Enable client-side validation
          </Switch>
        </div>
      </div>
      <Form clientSideValidationEnabled={clientSideValidationEnabled} />
    </div>
  );
}
