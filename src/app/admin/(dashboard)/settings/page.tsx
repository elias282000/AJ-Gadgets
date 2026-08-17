import { adminGetSettings, adminGetCategories } from "@/lib/admin";
import { SettingsForm } from "./SettingsForm";
import { CategoriesManager } from "./CategoriesManager";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [settings, categories] = await Promise.all([
    adminGetSettings(),
    adminGetCategories(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
        Settings
      </h1>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Delivery fees
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Shown to customers at checkout.
        </p>
        <div className="mt-4">
          <SettingsForm
            deliveryFeeDhaka={settings.deliveryFeeDhaka}
            deliveryFeeOutsideDhaka={settings.deliveryFeeOutsideDhaka}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Categories
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Used to organize products and to filter the shop page. Deleting a
          category doesn&apos;t delete its products — they just become
          uncategorized.
        </p>
        <div className="mt-4">
          <CategoriesManager categories={categories} />
        </div>
      </section>
    </div>
  );
}
