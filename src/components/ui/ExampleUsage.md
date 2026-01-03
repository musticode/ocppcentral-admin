# Modal Components Usage Examples

## Create Tariff Modal

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTariffModal } from "@/features/tariff/CreateTariffModal";

function TariffPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create Tariff</Button>
      <CreateTariffModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => {
          // Refresh data or show success message
          console.log("Tariff created!");
        }}
      />
    </>
  );
}
```

## Create User Modal

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateUserModal } from "@/features/user/CreateUserModal";

function UserPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create User</Button>
      <CreateUserModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => {
          // Refresh user list
          console.log("User created!");
        }}
      />
    </>
  );
}
```

## Create RFID Tag Modal

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateRFIDTagModal } from "@/features/rfidtags/CreateRFIDTagModal";

function RFIDPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create RFID Tag</Button>
      <CreateRFIDTagModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => {
          // Refresh RFID tag list
          console.log("RFID Tag created!");
        }}
      />
    </>
  );
}
```

## Detail Modal (Generic)

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DetailModal } from "@/components/ui/DetailModal";

function ExamplePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Details</Button>
      <DetailModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="User Details"
        description="View user information"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> John Doe
          </div>
          <div>
            <strong>Email:</strong> john@example.com
          </div>
        </div>
      </DetailModal>
    </>
  );
}
```
