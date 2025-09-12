// ===== Lesson 1: Types, Interfaces, Enums =====

// 1) type vs interface
type UserId = string;

interface Address {
  street: string;
  city: string;
  country: string;
  // Optional field with ?
  zip?: string;
  timezone?: string;
}

interface User {
  readonly id: UserId; // readonly prevents accidental mutation
  name: string;
  email: string;
  role: Role; // enum below
  address: Address;
  // Union type for status
  status: "active" | "inactive" | "pending" | "suspended";
}

// 2) Enums (string enums are clearer in logs)
export enum Role {
  Admin = "admin",
  QA = "qa",
  Dev = "dev",
}

// 3) Narrowing & utility type demo
type PartialUser = Partial<User>; // make all fields optional (handy for updates)

// 4) A tiny function that uses types well
export function canAccessTestDashboard(user: User): boolean {
  // Narrowing by union literal
  if (user.status !== "active") return false;

  // Role-based access
  return user.role === Role.Admin || user.role === Role.QA;
}

// 5) Another function: safe "update" using Partial + spread
export function applyUserPatch(user: User, patch: PartialUser): User {
  // Don't allow id changes even if provided in patch
  const { id: _ignore, ...rest } = patch;
  return { ...user, ...rest };
}

// 6) Quick inline “test” (no framework yet)
const demoUser: User = {
  id: "u_123",
  name: "Dana QA",
  email: "dana@example.com",
  role: Role.QA,
  address: { street: "1 Test Ave", city: "Tel Aviv", country: "IL" },
  status: "active",
};

console.log("canAccessTestDashboard(demoUser) ->", canAccessTestDashboard(demoUser));
// Try a patch
const updated = applyUserPatch(demoUser, {
  status: "inactive",
  address: { ...demoUser.address, city: "Haifa", timezone: "Asia/Jerusalem" },
});
console.log("Updated user:", updated);

// === TODOs for you (complete these in ~10 minutes) ===
// 1) Create another user with role Dev and status active. Verify access -> should be false.
// 2) Try to mutate demoUser.id = "new"; // should ERROR because readonly
// 3) Add a new literal "suspended" to the status union and update code to keep it blocked from access.
// 4) Add a new field to Address: timezone?: string; and patch it via applyUserPatch.
// 5) Create a union type PaymentMethod = "card" | "paypal" | { bankIban: string }
//    Write a function getPayLabel(m: PaymentMethod): string that returns a human-readable label.

// 1
const devUser: User = {
  id: "u_456",
  name: "Dev User",
  email: "dev@example.com",
  role: Role.Dev,
  address: { street: "2 Dev St", city: "Tel Aviv", country: "IL" },
  status: "active",
};

console.log("canAccessTestDashboard(devUser) ->", canAccessTestDashboard(devUser));

const newUser: User = {
  id: "u_789",
  name: "Suspended User",
  email: "suspended@example.com",
  role: Role.Admin,

  address: { street: "3 Suspended St", city: "Tel Aviv", country: "IL" },
  status: "active",
};
console.log("canAccessTestDashboard(newUser) ->", canAccessTestDashboard(newUser));
// 2) Try to mutate demoUser.id = "new"; // should ERROR because readonly

type PaymentMethod = "card" | "paypal" | { bankIban: string };

function getPayLabel(m: PaymentMethod): string {
  if (typeof m === "string") {
    return m.charAt(0).toUpperCase() + m.slice(1); // Capitalize first letter
  } else {
    const { bankIban } = m;
    const last4 = bankIban.slice(-4); // last 4 digits
    return `****${last4}`;
  }
}

console.log(getPayLabel("card"));
console.log(getPayLabel({ bankIban: "DE89370400440532013000" }));
