import "server-only";

export function canSwitchDemoRole(clerkId: string) {
    return process.env.NODE_ENV === "development"
        && process.env.DEMO_MODE === "true"
        && clerkId === process.env.ADMIN_USR_ID;
}
