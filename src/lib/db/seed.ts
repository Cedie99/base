import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const [admin] = await db
    .insert(schema.users)
    .values({
      name: "Admin User",
      email: "admin@base.com",
      password: adminPassword,
      role: "admin",
    })
    .onConflictDoNothing()
    .returning();

  if (!admin) {
    console.log("Admin user already exists, skipping seed.");
    await client.end();
    return;
  }

  console.log("Created admin user: admin@base.com / admin123");

  // Create moderator user
  const modPassword = await bcrypt.hash("mod12345", 10);
  await db.insert(schema.users).values({
    name: "Moderator User",
    email: "mod@base.com",
    password: modPassword,
    role: "moderator",
  });
  console.log("Created moderator user: mod@base.com / mod12345");

  // Create regular user
  const userPassword = await bcrypt.hash("user1234", 10);
  await db.insert(schema.users).values({
    name: "Regular User",
    email: "user@base.com",
    password: userPassword,
    role: "user",
  });
  console.log("Created regular user: user@base.com / user1234");

  // Sample company listing
  const [hostgator] = await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "hostgator",
      name: "HostGator",
      approvalStatus: "approved",
      legalName: "HostGator.com LLC",
      url: "https://www.hostgator.com",
      phone: "+1-866-964-2867",
      email: "info@hostgator.com",
      employees: 1500,
      foundingDate: "2002",
      companyStatus: "acquired",
      overview:
        "HostGator is a Houston-based provider of shared, reseller, VPS, and dedicated web hosting with an additional presence in Austin, Texas.",
      createdById: admin.id,
    })
    .returning();

  // Add widgets for HostGator
  await db.insert(schema.listingOffices).values([
    {
      listingId: hostgator.id,
      address: "5005 Mitchelldale, Suite 100",
      city: "Houston",
      state: "TX",
      country: "US",
      postalCode: "77092",
      isHq: true,
      label: "Houston Office (HQ)",
    },
    {
      listingId: hostgator.id,
      address: "1301 S Capital of Texas Hwy",
      city: "Austin",
      state: "TX",
      country: "US",
      postalCode: "78746",
      isHq: false,
      label: "Austin Office",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: hostgator.id, name: "Shared Hosting" },
    { listingId: hostgator.id, name: "VPS" },
    { listingId: hostgator.id, name: "Dedicated Hosting" },
    { listingId: hostgator.id, name: "Reseller Hosting" },
    { listingId: hostgator.id, name: "Domain Name Registration" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: hostgator.id, tag: "Web Hosting" },
    { listingId: hostgator.id, tag: "Cloud Hosting" },
    { listingId: hostgator.id, tag: "WordPress Hosting" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: hostgator.id,
      title: "Founded",
      description: "HostGator was founded by Brent Oxley in a dorm room.",
      date: "2002",
    },
    {
      listingId: hostgator.id,
      title: "Acquired by EIG",
      description:
        "Endurance International Group acquired HostGator for approximately $299 million.",
      date: "2012-07",
    },
  ]);

  await db.insert(schema.listingAcquisitions).values({
    listingId: hostgator.id,
    acquiredCompany: "HostGator (by EIG)",
    date: "2012",
    price: "$299 million",
    description: "Acquired by Endurance International Group",
  });

  console.log("Created sample company: HostGator");

  // Sample datacenter listing
  const [equinix] = await db
    .insert(schema.listings)
    .values({
      category: "datacenter",
      slug: "equinix",
      name: "Equinix",
      approvalStatus: "approved",
      legalName: "Equinix, Inc.",
      url: "https://www.equinix.com",
      employees: 11000,
      foundingDate: "1998",
      companyStatus: "publicly_held",
      overview:
        "Equinix is the world's largest data center and colocation infrastructure provider, with 240+ data centers across 71 metros.",
      createdById: admin.id,
    })
    .returning();

  await db.insert(schema.listingOffices).values({
    listingId: equinix.id,
    address: "One Lagoon Drive",
    city: "Redwood City",
    state: "CA",
    country: "US",
    postalCode: "94065",
    isHq: true,
    label: "Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: equinix.id, name: "Colocation" },
    { listingId: equinix.id, name: "Dedicated Hosting" },
  ]);

  console.log("Created sample datacenter: Equinix");

  // Sample registrar listing
  const [namecheap] = await db
    .insert(schema.listings)
    .values({
      category: "registrar",
      slug: "namecheap",
      name: "Namecheap",
      approvalStatus: "approved",
      legalName: "Namecheap, Inc.",
      url: "https://www.namecheap.com",
      employees: 1500,
      foundingDate: "2000",
      companyStatus: "privately_held",
      overview:
        "Namecheap is an ICANN-accredited domain name registrar and web hosting company, known for affordable domain registration.",
      createdById: admin.id,
    })
    .returning();

  await db.insert(schema.listingProducts).values([
    { listingId: namecheap.id, name: "Domain Name Registration" },
    { listingId: namecheap.id, name: "Shared Hosting" },
    { listingId: namecheap.id, name: "SSL Certificate" },
  ]);

  await db.insert(schema.listingCoupons).values({
    listingId: namecheap.id,
    code: "NEWCOM598",
    discount: "Up to 59% off .com domains",
    expiresAt: "2026-12-31",
  });

  console.log("Created sample registrar: Namecheap");

  // Sample person listing
  await db.insert(schema.listings).values({
    category: "person",
    slug: "brent-oxley",
    name: "Brent Oxley",
    approvalStatus: "approved",
    firstName: "Brent",
    lastName: "Oxley",
    overview:
      "Brent Oxley is the founder of HostGator, one of the world's largest web hosting companies. He started the company in 2002 from his dorm room at Florida Atlantic University.",
    linkedinUrl: "https://www.linkedin.com/in/brentoxley",
    createdById: admin.id,
  });

  console.log("Created sample person: Brent Oxley");

  console.log("\nSeed completed successfully!");
  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
