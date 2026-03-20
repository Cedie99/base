import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // ── Users ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  let admin = (
    await db.select().from(schema.users).where(eq(schema.users.email, "admin@MESH.com")).limit(1)
  )[0];

  if (!admin) {
    const [newAdmin] = await db
      .insert(schema.users)
      .values({
        name: "Admin User",
        email: "admin@MESH.com",
        password: adminPassword,
        role: "admin",
      })
      .returning();
    admin = newAdmin;
    console.log("Created admin user: admin@MESH.com / admin123");
  } else {
    console.log("Admin user already exists, reusing for new listings.");
  }

  const modPassword = await bcrypt.hash("mod12345", 10);
  await db.insert(schema.users).values({
    name: "Moderator User",
    email: "mod@MESH.com",
    password: modPassword,
    role: "moderator",
  }).onConflictDoNothing();
  console.log("Created moderator user: mod@MESH.com / mod12345");

  const userPassword = await bcrypt.hash("user1234", 10);
  await db.insert(schema.users).values({
    name: "Regular User",
    email: "user@MESH.com",
    password: userPassword,
    role: "user",
  }).onConflictDoNothing();
  console.log("Created regular user: user@MESH.com / user1234");

  // ══════════════════════════════════════════════════════
  // COMPANY 1: HostGator
  // ══════════════════════════════════════════════════════
  let hostgator = (await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "hostgator",
      name: "HostGator",
      approvalStatus: "approved",
      legalName: "HostGator.com LLC",
      url: "https://www.hostgator.com",
      blogUrl: "https://www.hostgator.com/blog",
      blogFeedUrl: "https://www.hostgator.com/blog/feed",
      twitterUsername: "hostgator",
      phone: "+1-866-964-2867",
      email: "info@hostgator.com",
      employees: 1500,
      servers: 12000,
      domainsManaged: 8000000,
      clients: 2000000,
      foundingDate: "2002",
      companyStatus: "acquired",
      logoUrl: "https://www.google.com/s2/favicons?domain=hostgator.com&sz=128",
      overview:
        "HostGator is a Houston-based provider of shared, reseller, VPS, and dedicated web hosting. Founded in 2002 by Brent Oxley in a dorm room at Florida Atlantic University, it grew into one of the world's largest hosting companies before being acquired by Endurance International Group (now Newfold Digital) in 2012 for approximately $299 million.\n\nThe company serves over 2 million customers worldwide and is known for its affordable hosting plans, 45-day money-back guarantee, and 24/7/365 support via phone, live chat, and email. HostGator operates its own data centers in Houston and Provo, Utah.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!hostgator) {
    hostgator = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "hostgator")).limit(1)
    )[0];
  }

  if (!hostgator) {
    throw new Error("Failed to create or load HostGator listing.");
  }

  await db.insert(schema.listingOffices).values([
    {
      listingId: hostgator.id,
      address: "5005 Mitchelldale, Suite 100",
      city: "Houston",
      state: "TX",
      country: "United States",
      postalCode: "77092",
      isHq: true,
      label: "Houston Office (HQ)",
    },
    {
      listingId: hostgator.id,
      address: "1301 S Capital of Texas Hwy",
      city: "Austin",
      state: "TX",
      country: "United States",
      postalCode: "78746",
      isHq: false,
      label: "Austin Office",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: hostgator.id, name: "Shared Hosting" },
    { listingId: hostgator.id, name: "VPS Hosting" },
    { listingId: hostgator.id, name: "Dedicated Hosting" },
    { listingId: hostgator.id, name: "Reseller Hosting" },
    { listingId: hostgator.id, name: "Cloud Hosting" },
    { listingId: hostgator.id, name: "Domain Name Registration" },
    { listingId: hostgator.id, name: "SSL Certificates" },
    { listingId: hostgator.id, name: "E-Mail Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: hostgator.id, tag: "Web Hosting" },
    { listingId: hostgator.id, tag: "Cloud Hosting" },
    { listingId: hostgator.id, tag: "WordPress Hosting" },
    { listingId: hostgator.id, tag: "Budget Hosting" },
    { listingId: hostgator.id, tag: "cPanel" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: hostgator.id,
      title: "Company Founded",
      description:
        "Brent Oxley founded HostGator in his dorm room at Florida Atlantic University.",
      date: "2002-10",
    },
    {
      listingId: hostgator.id,
      title: "1 Million Domains Hosted",
      description:
        "HostGator reached the milestone of hosting over 1 million domains.",
      date: "2008-06",
    },
    {
      listingId: hostgator.id,
      title: "Acquired by Endurance International Group",
      description:
        "EIG acquired HostGator for approximately $299 million, adding it to their portfolio of hosting brands.",
      date: "2012-07",
    },
    {
      listingId: hostgator.id,
      title: "Newfold Digital Rebrand",
      description:
        "Endurance International Group rebranded to Newfold Digital after merging with Web.com Group.",
      date: "2021-02",
    },
  ]);

  await db.insert(schema.listingAcquisitions).values({
    listingId: hostgator.id,
    acquiredCompany: "HostGator (by EIG)",
    date: "2012-07",
    price: "$299 million",
    description:
      "Endurance International Group acquired HostGator, making it one of the largest hosting acquisitions at the time.",
  });

  await db.insert(schema.listingFunding).values({
    listingId: hostgator.id,
    roundName: "Bootstrapped",
    amount: "Self-funded",
    date: "2002",
    investors: "Brent Oxley (Founder)",
  });

  await db.insert(schema.listingCoupons).values([
    {
      listingId: hostgator.id,
      code: "SNAPPY",
      discount: "60% off all shared hosting plans",
      expiresAt: "2026-12-31",
      votesYes: 42,
      votesNo: 3,
    },
    {
      listingId: hostgator.id,
      code: "STARTER25",
      discount: "25% off first month of VPS hosting",
      expiresAt: "2026-06-30",
      votesYes: 18,
      votesNo: 1,
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: hostgator.id,
      title: "HostGator Launches New Cloud Platform",
      url: "https://www.hostgator.com/blog/new-cloud-platform",
      source: "HostGator Blog",
      date: "2025-11",
    },
    {
      listingId: hostgator.id,
      title: "Newfold Digital Reports Q3 2025 Earnings",
      source: "PR Newswire",
      date: "2025-10",
    },
  ]);

  await db.insert(schema.listingExternalLinks).values([
    {
      listingId: hostgator.id,
      title: "HostGator on Wikipedia",
      url: "https://en.wikipedia.org/wiki/HostGator",
    },
    {
      listingId: hostgator.id,
      title: "HostGator on Crunchbase",
      url: "https://www.crunchbase.com/organization/hostgator",
    },
  ]);

  await db.insert(schema.listingSources).values([
    {
      listingId: hostgator.id,
      title: "HostGator Wikipedia Article",
      url: "https://en.wikipedia.org/wiki/HostGator",
    },
    {
      listingId: hostgator.id,
      title: "EIG Acquires HostGator - TechCrunch",
      url: "https://techcrunch.com/2012/07/hostgator-acquired",
    },
  ]);

  await db.insert(schema.listingPeople).values([
    {
      listingId: hostgator.id,
      name: "Brent Oxley",
      title: "Founder",
      role: "Founder",
    },
    {
      listingId: hostgator.id,
      name: "Mike Jenkins",
      title: "CEO",
      role: "Executive",
    },
  ]);

  console.log("Created company: HostGator (with full widgets)");

  // ══════════════════════════════════════════════════════
  // COMPANY 2: DigitalOcean
  // ══════════════════════════════════════════════════════
  let digitalocean = (await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "digitalocean",
      name: "DigitalOcean",
      approvalStatus: "approved",
      legalName: "DigitalOcean Holdings, Inc.",
      url: "https://www.digitalocean.com",
      blogUrl: "https://www.digitalocean.com/blog",
      blogFeedUrl: "https://www.digitalocean.com/blog/rss",
      twitterUsername: "digitalocean",
      phone: "+1-347-903-7918",
      email: "support@digitalocean.com",
      employees: 1200,
      servers: 200000,
      clients: 600000,
      foundingDate: "2011",
      companyStatus: "publicly_held",
      stockTicker: "DOCN",
      logoUrl: "https://www.google.com/s2/favicons?domain=digitalocean.com&sz=128",
      overview:
        "DigitalOcean is a cloud infrastructure provider offering cloud computing services to software developers and businesses. Known for its simplicity and developer-friendly approach, DigitalOcean provides virtual private servers (Droplets), managed Kubernetes, managed databases, object storage (Spaces), and an app platform.\n\nHeadquartered in New York City, the company went public on the NYSE in March 2021 under the ticker symbol DOCN. DigitalOcean operates 15 data center regions worldwide and serves over 600,000 customers in 185+ countries.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!digitalocean) {
    digitalocean = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "digitalocean")).limit(1)
    )[0];
  }

  if (!digitalocean) {
    throw new Error("Failed to create or load DigitalOcean listing.");
  }

  if (digitalocean?.id) {
    await db.insert(schema.listingOffices).values([
    {
      listingId: digitalocean.id,
      address: "101 Avenue of the Americas",
      city: "New York",
      state: "NY",
      country: "United States",
      postalCode: "10013",
      isHq: true,
      label: "New York Office (HQ)",
    },
    {
      listingId: digitalocean.id,
      address: "Krtunamirussell 4",
      city: "Amsterdam",
      country: "Netherlands",
      postalCode: "1033 SM",
      isHq: false,
      label: "Amsterdam Office",
    },
  ]);
  await db.insert(schema.listingMilestones).values([
    {
      listingId: digitalocean.id,
      title: "Company Founded",
      description:
        "Ben and Moisey Uretsky founded DigitalOcean to simplify cloud computing for developers.",
      date: "2011",
    },
    {
      listingId: digitalocean.id,
      title: "Techstars Accelerator",
      description:
        "DigitalOcean was accepted into the Techstars Boulder accelerator program.",
      date: "2012",
    },
    {
      listingId: digitalocean.id,
      title: "Series A Funding",
      description:
        "Raised $3.2 million in Series A from IA Ventures and Techstars.",
      date: "2013-03",
    },
    {
      listingId: digitalocean.id,
      title: "IPO on NYSE",
      description:
        "DigitalOcean went public on the NYSE under ticker DOCN, valued at approximately $5 billion.",
      date: "2021-03",
    },
    {
      listingId: digitalocean.id,
      title: "Acquired Cloudways",
      description:
        "DigitalOcean acquired managed hosting platform Cloudways for $350 million.",
      date: "2022-09",
    },
  ]);

  await db.insert(schema.listingFunding).values([
    {
      listingId: digitalocean.id,
      roundName: "Series A",
      amount: "$3.2 million",
      date: "2013-03",
      investors: "IA Ventures, Techstars",
    },
    {
      listingId: digitalocean.id,
      roundName: "Series B",
      amount: "$83 million",
      date: "2015-07",
      investors: "Access Industries, Andreessen Horowitz",
    },
  ]);

  await db.insert(schema.listingAcquisitions).values({
    listingId: digitalocean.id,
    acquiredCompany: "Cloudways",
    date: "2022-09",
    price: "$350 million",
    description:
      "Managed cloud hosting platform acquired to expand managed hosting offerings.",
  });

  await db.insert(schema.listingExits).values({
    listingId: digitalocean.id,
    exitType: "IPO",
    date: "2021-03",
    amount: "$5 billion valuation",
    description:
      "IPO on the New York Stock Exchange under ticker DOCN.",
  });

  await db.insert(schema.listingPeople).values([
    {
      listingId: digitalocean.id,
      name: "Ben Uretsky",
      title: "Co-Founder",
      role: "Founder",
    },
    {
      listingId: digitalocean.id,
      name: "Paddy Srinivasan",
      title: "CEO",
      role: "Executive",
    },
  ]);

  await db.insert(schema.listingSources).values([
    {
      listingId: digitalocean.id,
      title: "DigitalOcean Wikipedia",
      url: "https://en.wikipedia.org/wiki/DigitalOcean",
    },
    {
      listingId: digitalocean.id,
      title: "DigitalOcean IPO - SEC Filing",
      url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=digitalocean",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: digitalocean.id,
      title: "DigitalOcean Launches GPU Droplets",
      url: "https://www.digitalocean.com/blog/gpu-droplets",
      source: "DigitalOcean Blog",
      date: "2025-09",
    },
  ]);

    console.log("Created company: DigitalOcean (with full widgets)");
  } else {
    console.log("DigitalOcean already exists, skipping widgets.");
  }

  // ══════════════════════════════════════════════════════
  // DATACENTER 1: Equinix
  // ══════════════════════════════════════════════════════
  let equinix = (await db
    .insert(schema.listings)
    .values({
      category: "datacenter",
      slug: "equinix",
      name: "Equinix",
      approvalStatus: "approved",
      legalName: "Equinix, Inc.",
      url: "https://www.equinix.com",
      blogUrl: "https://blog.equinix.com",
      blogFeedUrl: "https://blog.equinix.com/feed",
      twitterUsername: "equinix",
      phone: "+1-650-598-6000",
      email: "info@equinix.com",
      employees: 13000,
      numberOfDatacenters: 260,
      totalSquareFootage: "42 million sq ft",
      foundingDate: "1998",
      companyStatus: "publicly_held",
      stockTicker: "EQIX",
      logoUrl: "https://www.google.com/s2/favicons?domain=equinix.com&sz=128",
      overview:
        "Equinix, Inc. is the world's largest data center and colocation infrastructure provider, operating 260+ International Business Exchange (IBX) data centers across 72 metros in 33 countries on six continents.\n\nAs a Real Estate Investment Trust (REIT) traded on NASDAQ under the ticker EQIX, Equinix connects the world's leading businesses to their customers, employees, and partners through the global platform known as Platform Equinix. The company specializes in interconnection services, enabling enterprises to directly and securely connect to each other and their clouds.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!equinix) {
    equinix = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "equinix")).limit(1)
    )[0];
  }

  if (!equinix) {
    throw new Error("Failed to create or load Equinix listing.");
  }

  if (equinix?.id) {

  await db.insert(schema.listingOffices).values([
    {
      listingId: equinix.id,
      address: "One Lagoon Drive",
      city: "Redwood City",
      state: "CA",
      country: "United States",
      postalCode: "94065",
      isHq: true,
      label: "Global Headquarters",
    },
    {
      listingId: equinix.id,
      address: "160 Queen Victoria Street",
      city: "London",
      state: "",
      country: "United Kingdom",
      postalCode: "EC4V 4BJ",
      isHq: false,
      label: "EMEA Headquarters",
    },
    {
      listingId: equinix.id,
      address: "20 Anson Road #11-01",
      city: "Singapore",
      state: "",
      country: "Singapore",
      postalCode: "079912",
      isHq: false,
      label: "Asia-Pacific Headquarters",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: equinix.id, name: "Colocation" },
    { listingId: equinix.id, name: "Dedicated Hosting" },
    { listingId: equinix.id, name: "Interconnection" },
    { listingId: equinix.id, name: "Managed Hosting" },
    { listingId: equinix.id, name: "Cloud Hosting" },
    { listingId: equinix.id, name: "Remote Hands" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: equinix.id, tag: "Colocation" },
    { listingId: equinix.id, tag: "Interconnection" },
    { listingId: equinix.id, tag: "REIT" },
    { listingId: equinix.id, tag: "Enterprise" },
    { listingId: equinix.id, tag: "Global" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: equinix.id,
      title: "Company Founded",
      description:
        "Jay Adelson and Al Avery founded Equinix to create carrier-neutral colocation data centers.",
      date: "1998",
    },
    {
      listingId: equinix.id,
      title: "IPO on NASDAQ",
      description:
        "Equinix went public on NASDAQ after surviving the dot-com bust.",
      date: "2000-08",
    },
    {
      listingId: equinix.id,
      title: "Acquired TelecityGroup",
      description:
        "Equinix acquired TelecityGroup for $3.6 billion, significantly expanding its European footprint.",
      date: "2016-01",
    },
    {
      listingId: equinix.id,
      title: "260+ Data Centers",
      description:
        "Equinix surpassed 260 data centers globally across 72 metros.",
      date: "2024",
    },
  ]);

  await db.insert(schema.listingFunding).values({
    listingId: equinix.id,
    roundName: "IPO",
    amount: "$287 million",
    date: "2000-08",
    investors: "Public market (NASDAQ: EQIX)",
  });

  await db.insert(schema.listingAcquisitions).values([
    {
      listingId: equinix.id,
      acquiredCompany: "TelecityGroup",
      date: "2016-01",
      price: "$3.6 billion",
      description:
        "Major European data center provider, significantly expanding Equinix's European presence.",
    },
    {
      listingId: equinix.id,
      acquiredCompany: "Verizon Data Centers",
      date: "2017-05",
      price: "$3.6 billion",
      description:
        "29 data center sites from Verizon, adding key US and Latin American facilities.",
    },
  ]);

  await db.insert(schema.listingPeople).values([
    {
      listingId: equinix.id,
      name: "Charles Meyers",
      title: "President & CEO",
      role: "Executive",
    },
    {
      listingId: equinix.id,
      name: "Jay Adelson",
      title: "Co-Founder",
      role: "Founder",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: equinix.id,
      title: "Equinix Expands in India with New Mumbai Data Center",
      source: "Data Center Dynamics",
      date: "2025-10",
    },
    {
      listingId: equinix.id,
      title: "Equinix Reports Record Revenue in Q3 2025",
      source: "PR Newswire",
      date: "2025-10",
    },
  ]);

  await db.insert(schema.listingExternalLinks).values([
    {
      listingId: equinix.id,
      title: "Equinix on Wikipedia",
      url: "https://en.wikipedia.org/wiki/Equinix",
    },
    {
      listingId: equinix.id,
      title: "Equinix Investor Relations",
      url: "https://investor.equinix.com",
    },
  ]);

  await db.insert(schema.listingSources).values([
    {
      listingId: equinix.id,
      title: "Equinix Wikipedia Article",
      url: "https://en.wikipedia.org/wiki/Equinix",
    },
    {
      listingId: equinix.id,
      title: "Equinix 2024 Annual Report",
      url: "https://investor.equinix.com/annual-reports",
    },
  ]);

  console.log("Created datacenter: Equinix (with full widgets)");
  } else {
    console.log("Equinix already exists, skipping widgets.");
  }

  // ══════════════════════════════════════════════════════
  // DATACENTER 2: CoreSite
  // ══════════════════════════════════════════════════════
  const [coresite] = (await db
    .insert(schema.listings)

    .values({
      category: "datacenter",
      slug: "coresite",
      name: "CoreSite Realty",
      approvalStatus: "approved",
      legalName: "CoreSite Realty Corporation",
      url: "https://www.coresite.com",
      blogUrl: "https://www.coresite.com/blog",
      twitterUsername: "caborecoresite",
      phone: "+1-866-777-2673",
      email: "sales@coresite.com",
      employees: 500,
      numberOfDatacenters: 27,
      totalSquareFootage: "4.6 million sq ft",
      foundingDate: "2001",
      companyStatus: "acquired",
      logoUrl: "https://www.google.com/s2/favicons?domain=coresite.com&sz=128",
      overview:
        "CoreSite Realty Corporation operates 27 data centers across 8 major US markets including Los Angeles, Denver, Northern Virginia, and the New York/New Jersey metro area. The company provides colocation, interconnection, and managed cloud services.\n\nIn November 2021, American Tower Corporation acquired CoreSite for approximately $10.1 billion, taking the company private after years of operating as a publicly traded REIT on the NYSE.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning()) || [{}];

  if (coresite?.id) {

  await db.insert(schema.listingOffices).values({
    listingId: coresite.id,
    address: "1001 17th Street, Suite 500",
    city: "Denver",
    state: "CO",
    country: "United States",
    postalCode: "80202",
    isHq: true,
    label: "Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: coresite.id, name: "Colocation" },
    { listingId: coresite.id, name: "Interconnection" },
    { listingId: coresite.id, name: "Cloud Hosting" },
    { listingId: coresite.id, name: "Managed Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: coresite.id, tag: "Colocation" },
    { listingId: coresite.id, tag: "US Markets" },
    { listingId: coresite.id, tag: "Interconnection" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: coresite.id,
      title: "Company Founded",
      description: "CoreSite was founded as a data center REIT.",
      date: "2001",
    },
    {
      listingId: coresite.id,
      title: "Acquired by American Tower",
      description:
        "American Tower Corporation acquired CoreSite for approximately $10.1 billion.",
      date: "2021-11",
    },
  ]);

  await db.insert(schema.listingSources).values({
    listingId: coresite.id,
    title: "CoreSite Wikipedia",
    url: "https://en.wikipedia.org/wiki/CoreSite",
  });

  console.log("Created datacenter: CoreSite (with widgets)");
  }

  // ══════════════════════════════════════════════════════
  // REGISTRAR 1: Namecheap
  // ══════════════════════════════════════════════════════
  let namecheap = (await db
    .insert(schema.listings)
    .values({
      category: "registrar",
      slug: "namecheap",
      name: "Namecheap",
      approvalStatus: "approved",
      legalName: "Namecheap, Inc.",
      url: "https://www.namecheap.com",
      blogUrl: "https://www.namecheap.com/blog",
      blogFeedUrl: "https://www.namecheap.com/blog/feed",
      twitterUsername: "Namecheap",
      phone: "+1-323-375-2822",
      email: "support@namecheap.com",
      employees: 1500,
      domainsManaged: 17000000,
      foundingDate: "2000",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=namecheap.com&sz=128",
      overview:
        "Namecheap is an ICANN-accredited domain name registrar and web hosting company based in Phoenix, Arizona. Founded in 2000 by Richard Kirkendall, Namecheap manages over 17 million domains for more than 5 million customers worldwide.\n\nKnown for its affordable domain registration, free WhoisGuard privacy protection, and user-friendly interface, Namecheap has grown into one of the largest domain registrars globally. The company also offers shared hosting, VPS, dedicated servers, SSL certificates, and a website builder.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!namecheap) {
    namecheap = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "namecheap")).limit(1)
    )[0];
  }

  if (!namecheap) {
    throw new Error("Failed to create or load Namecheap listing.");
  }

  console.log("Created registrar: Namecheap (with full widgets)");

  await db.insert(schema.listingProducts).values([
    { listingId: namecheap.id, name: "Domain Name Registration" },
    { listingId: namecheap.id, name: "Domain Name Search" },
    { listingId: namecheap.id, name: "Private Whois" },
    { listingId: namecheap.id, name: "DNS Hosting" },
    { listingId: namecheap.id, name: "Web Hosting" },
    { listingId: namecheap.id, name: "SSL Certificates" },
    { listingId: namecheap.id, name: "E-Mail Hosting" },
    { listingId: namecheap.id, name: "Site Builder" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: namecheap.id, tag: "Domain Registrar" },
    { listingId: namecheap.id, tag: "Web Hosting" },
    { listingId: namecheap.id, tag: "SSL" },
    { listingId: namecheap.id, tag: "Privacy" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: namecheap.id,
      title: "Company Founded",
      description:
        "Richard Kirkendall founded Namecheap as an affordable alternative to established registrars.",
      date: "2000",
    },
    {
      listingId: namecheap.id,
      title: "Free WhoisGuard Launch",
      description:
        "Namecheap began offering free WhoisGuard privacy protection with all domain registrations.",
      date: "2014",
    },
    {
      listingId: namecheap.id,
      title: "10 Million Domains",
      description:
        "Namecheap reached the milestone of managing 10 million domain names.",
      date: "2018",
    },
    {
      listingId: namecheap.id,
      title: "17 Million Domains",
      description:
        "Namecheap reached 17 million domains under management, cementing its position as a top registrar.",
      date: "2024",
    },
  ]);

  await db.insert(schema.listingCoupons).values([
    {
      listingId: namecheap.id,
      code: "NEWCOM598",
      discount: "Up to 59% off .com domains",
      expiresAt: "2026-12-31",
      votesYes: 56,
      votesNo: 4,
    },
    {
      listingId: namecheap.id,
      code: "COUPONNC",
      discount: "20% off all hosting plans",
      expiresAt: "2026-09-30",
      votesYes: 23,
      votesNo: 2,
    },
    {
      listingId: namecheap.id,
      code: "NCSSL25",
      discount: "25% off all SSL certificates",
      expiresAt: "2026-06-30",
      votesYes: 14,
      votesNo: 0,
    },
  ]);

  await db.insert(schema.listingPeople).values([
    {
      listingId: namecheap.id,
      name: "Richard Kirkendall",
      title: "Founder & CEO",
      role: "Executive",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: namecheap.id,
      title: "Namecheap Launches Redesigned Domain Search Experience",
      source: "Namecheap Blog",
      date: "2025-08",
    },
  ]);

  await db.insert(schema.listingExternalLinks).values([
    {
      listingId: namecheap.id,
      title: "Namecheap on Wikipedia",
      url: "https://en.wikipedia.org/wiki/Namecheap",
    },
  ]);

  await db.insert(schema.listingSources).values([
    {
      listingId: namecheap.id,
      title: "Namecheap Wikipedia Article",
      url: "https://en.wikipedia.org/wiki/Namecheap",
    },
    {
      listingId: namecheap.id,
      title: "Namecheap About Page",
      url: "https://www.namecheap.com/about/",
    },
  ]);

  console.log("Created registrar: Namecheap (with full widgets)");

  // ══════════════════════════════════════════════════════
  // REGISTRAR 2: GoDaddy
  // ══════════════════════════════════════════════════════
  let godaddy = (await db
    .insert(schema.listings)
    .values({
      category: "registrar",
      slug: "godaddy",
      name: "GoDaddy",
      approvalStatus: "approved",
      legalName: "GoDaddy Inc.",
      url: "https://www.godaddy.com",
      blogUrl: "https://www.godaddy.com/garage",
      blogFeedUrl: "https://www.godaddy.com/garage/feed",
      twitterUsername: "GoDaddy",
      phone: "+1-480-505-8877",
      email: "support@godaddy.com",
      employees: 7000,
      domainsManaged: 84000000,
      foundingDate: "1997",
      companyStatus: "publicly_held",
      stockTicker: "GDDY",
      logoUrl: "https://www.google.com/s2/favicons?domain=godaddy.com&sz=128",
      overview:
        "GoDaddy Inc. is the world's largest domain registrar and web hosting company, managing more than 84 million domain names for over 21 million customers. Founded in 1997 by Bob Parsons in Scottsdale, Arizona, the company provides domain registration, web hosting, website building tools, e-commerce solutions, and marketing services.\n\nGoDaddy went public on the NYSE in 2015 under the ticker GDDY. The company is known for its Super Bowl advertisements and its focus on serving small businesses and individual entrepreneurs.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!godaddy) {
    godaddy = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "godaddy")).limit(1)
    )[0];
  }

  if (!godaddy) {
    throw new Error("Failed to create or load GoDaddy listing.");
  }

  await db.insert(schema.listingOffices).values([
    {
      listingId: godaddy.id,
      address: "2155 E GoDaddy Way",
      city: "Tempe",
      state: "AZ",
      country: "United States",
      postalCode: "85284",
      isHq: true,
      label: "Global Headquarters",
    },
    {
      listingId: godaddy.id,
      address: "Hiranandani Business Park, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400076",
      isHq: false,
      label: "India Office",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: godaddy.id, name: "Domain Name Registration" },
    { listingId: godaddy.id, name: "Domain Name Parking" },
    { listingId: godaddy.id, name: "Domain Name Search" },
    { listingId: godaddy.id, name: "Private Whois" },
    { listingId: godaddy.id, name: "Web Hosting" },
    { listingId: godaddy.id, name: "SSL Certificates" },
    { listingId: godaddy.id, name: "Domain Name Marketplace" },
    { listingId: godaddy.id, name: "Domain Name Auction" },
    { listingId: godaddy.id, name: "Site Builder" },
    { listingId: godaddy.id, name: "E-Mail Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: godaddy.id, tag: "Domain Registrar" },
    { listingId: godaddy.id, tag: "Web Hosting" },
    { listingId: godaddy.id, tag: "Small Business" },
    { listingId: godaddy.id, tag: "Website Builder" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: godaddy.id,
      title: "Company Founded",
      description:
        "Bob Parsons founded Jomax Technologies, which later rebranded to GoDaddy.",
      date: "1997",
    },
    {
      listingId: godaddy.id,
      title: "IPO on NYSE",
      description:
        "GoDaddy went public on the NYSE under the ticker symbol GDDY.",
      date: "2015-04",
    },
  ]);

  await db.insert(schema.listingPeople).values([
    {
      listingId: godaddy.id,
      name: "Bob Parsons",
      title: "Founder",
      role: "Founder",
    },
    {
      listingId: godaddy.id,
      name: "Aman Bhutani",
      title: "CEO",
      role: "Executive",
    },
  ]);

  await db.insert(schema.listingSources).values({
    listingId: godaddy.id,
    title: "GoDaddy Wikipedia",
    url: "https://en.wikipedia.org/wiki/GoDaddy",
  });

  console.log("Created registrar: GoDaddy (with widgets)");

  // ══════════════════════════════════════════════════════
  // PERSON 1: Brent Oxley
  // ══════════════════════════════════════════════════════
  let brentOxley = (await db
    .insert(schema.listings)
    .values({
      category: "person",
      slug: "brent-oxley",
      name: "Brent Oxley",
      approvalStatus: "approved",
      firstName: "Brent",
      lastName: "Oxley",
      phone: "+1-561-555-0100",
      email: "brent@example.com",
      homepageUrl: "https://brentoxley.com",
      blogUrl: "https://brentoxley.com/blog",
      blogFeedUrl: "https://brentoxley.com/blog/feed",
      twitterUsername: "baboretrick",
      linkedinUrl: "https://www.linkedin.com/in/brentoxley",
      facebookUrl: "https://www.facebook.com/brentoxley",
      instagramUrl: "https://www.instagram.com/brentoxley",
      birthplace: "Boca Raton, FL",
      birthdate: "1982-03-15",
      photoUrl: "https://ui-avatars.com/api/?name=Brent+Oxley&size=256&background=3b82f6&color=fff",
      overview:
        "Brent Oxley is a serial entrepreneur best known as the founder of HostGator, one of the world's largest web hosting companies. He started HostGator in 2002 from his dorm room at Florida Atlantic University while studying business management.\n\nIn 2012, Oxley sold HostGator to Endurance International Group for approximately $299 million. After the sale, he moved to Brazil and later founded several other ventures in the technology and real estate sectors.\n\nOxley is known for his entrepreneurial spirit and his philosophy of building businesses from the ground up without outside funding. He grew HostGator from zero to over $200 million in annual revenue before selling.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!brentOxley) {
    brentOxley = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "brent-oxley")).limit(1)
    )[0];
  }

  if (!brentOxley) {
    throw new Error("Failed to create or load Brent Oxley listing.");
  }

  await db.insert(schema.personDegrees).values([
    {
      listingId: brentOxley.id,
      institution: "Florida Atlantic University",
      subject: "Business Management",
      degreeType: "B.S.",
      graduationYear: "2004",
    },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: brentOxley.id,
      title: "Founded HostGator",
      description:
        "Started HostGator from his dorm room at Florida Atlantic University.",
      date: "2002",
    },
    {
      listingId: brentOxley.id,
      title: "Sold HostGator to EIG",
      description:
        "Sold HostGator to Endurance International Group for approximately $299 million.",
      date: "2012-07",
    },
    {
      listingId: brentOxley.id,
      title: "Relocated to Brazil",
      description:
        "Moved to Brazil to pursue new business ventures and lifestyle.",
      date: "2013",
    },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: brentOxley.id, tag: "Entrepreneur" },
    { listingId: brentOxley.id, tag: "Web Hosting" },
    { listingId: brentOxley.id, tag: "Founder" },
  ]);

  await db.insert(schema.listingNews).values({
    listingId: brentOxley.id,
    title: "From Dorm Room to $299M Exit: The Brent Oxley Story",
    source: "Entrepreneur Magazine",
    date: "2023-02",
  });

  await db.insert(schema.listingExternalLinks).values([
    {
      listingId: brentOxley.id,
      title: "Brent Oxley LinkedIn",
      url: "https://www.linkedin.com/in/brentoxley",
    },
  ]);

  await db.insert(schema.listingSources).values([
    {
      listingId: brentOxley.id,
      title: "HostGator Wikipedia",
      url: "https://en.wikipedia.org/wiki/HostGator",
    },
    {
      listingId: brentOxley.id,
      title: "Brent Oxley Interview - Mixergy",
      url: "https://mixergy.com/interviews/brent-oxley-hostgator-interview",
    },
  ]);

  console.log("Created person: Brent Oxley (with full widgets)");

  // ══════════════════════════════════════════════════════
  // PERSON 2: Richard Kirkendall
  // ══════════════════════════════════════════════════════
  let richardK = (await db
    .insert(schema.listings)
    .values({
      category: "person",
      slug: "richard-kirkendall",
      name: "Richard Kirkendall",
      approvalStatus: "approved",
      firstName: "Richard",
      lastName: "Kirkendall",
      email: "richard@namecheap.com",
      homepageUrl: "https://www.namecheap.com",
      blogUrl: "https://www.namecheap.com/blog",
      twitterUsername: "NamecheapCEO",
      linkedinUrl: "https://www.linkedin.com/in/richardkirkendall",
      birthplace: "United States",
      photoUrl: "https://ui-avatars.com/api/?name=Richard+Kirkendall&size=256&background=10b981&color=fff",
      overview:
        "Richard Kirkendall is the founder and CEO of Namecheap, one of the world's largest domain name registrars. He founded the company in 2000 with the mission of making domain registration affordable and accessible for everyone.\n\nUnder his leadership, Namecheap has grown to manage over 17 million domain names and serve more than 5 million customers worldwide. Kirkendall is known for his advocacy of internet privacy, net neutrality, and affordable internet services. He has kept Namecheap privately held, allowing the company to focus on customer service over shareholder returns.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!richardK) {
    richardK = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "richard-kirkendall")).limit(1)
    )[0];
  }

  if (!richardK) {
    throw new Error("Failed to create or load Richard Kirkendall listing.");
  }

  await db.insert(schema.personDegrees).values([
    {
      listingId: richardK.id,
      institution: "University of California",
      subject: "Computer Science",
      degreeType: "B.S.",
      graduationYear: "1996",
    },
    {
      listingId: richardK.id,
      institution: "Stanford University",
      subject: "Business Administration",
      degreeType: "MBA",
      graduationYear: "1999",
    },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: richardK.id,
      title: "Founded Namecheap",
      description:
        "Founded Namecheap to offer affordable domain registration as an alternative to expensive registrars.",
      date: "2000",
    },
    {
      listingId: richardK.id,
      title: "Move Domains Day",
      description:
        "Led the 'Move Your Domain Day' campaign protesting SOPA, resulting in tens of thousands of domains transferred from GoDaddy to Namecheap.",
      date: "2011-12",
    },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: richardK.id, tag: "CEO" },
    { listingId: richardK.id, tag: "Domain Industry" },
    { listingId: richardK.id, tag: "Privacy Advocate" },
  ]);

  await db.insert(schema.listingSources).values({
    listingId: richardK.id,
    title: "Namecheap About Page",
    url: "https://www.namecheap.com/about/",
  });

  console.log("Created person: Richard Kirkendall (with full widgets)");

  // ══════════════════════════════════════════════════════
  // PERSON 3: Jay Adelson
  // ══════════════════════════════════════════════════════
  let jayAdelson = (await db
    .insert(schema.listings)
    .values({
      category: "person",
      slug: "jay-adelson",
      name: "Jay Adelson",
      approvalStatus: "approved",
      firstName: "Jay",
      lastName: "Adelson",
      homepageUrl: "https://jayadelson.com",
      twitterUsername: "jayadelson",
      linkedinUrl: "https://www.linkedin.com/in/jayadelson",
      birthplace: "New York, NY",
      birthdate: "1970-10-24",
      photoUrl: "https://ui-avatars.com/api/?name=Jay+Adelson&size=256&background=8b5cf6&color=fff",
      overview:
        "Jay Adelson is a technology entrepreneur and executive known for co-founding Equinix, the world's largest data center company. He also co-founded Digg, the social news website, and has served as CEO of multiple technology companies.\n\nAdelson began his career at Digital Equipment Corporation and later worked at Netcom before founding Equinix in 1998 with Al Avery. He served as Equinix's CEO until 2000. He went on to co-found Digg in 2004, serving as its CEO until 2010.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!jayAdelson) {
    jayAdelson = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "jay-adelson")).limit(1)
    )[0];
  }

  if (!jayAdelson) {
    throw new Error("Failed to create or load Jay Adelson listing.");
  }

  await db.insert(schema.personDegrees).values([
    {
      listingId: jayAdelson.id,
      institution: "Boston University",
      subject: "Film & Television",
      degreeType: "B.S.",
      graduationYear: "1992",
    },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: jayAdelson.id,
      title: "Co-Founded Equinix",
      description:
        "Co-founded Equinix with Al Avery to create carrier-neutral data centers.",
      date: "1998",
    },
    {
      listingId: jayAdelson.id,
      title: "Co-Founded Digg",
      description:
        "Co-founded social news site Digg with Kevin Rose.",
      date: "2004",
    },
    {
      listingId: jayAdelson.id,
      title: "Founded Opsmatic",
      description:
        "Founded server monitoring platform Opsmatic, later acquired by New Relic.",
      date: "2013",
    },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: jayAdelson.id, tag: "Serial Entrepreneur" },
    { listingId: jayAdelson.id, tag: "Data Centers" },
    { listingId: jayAdelson.id, tag: "Media" },
  ]);

  await db.insert(schema.listingSources).values({
    listingId: jayAdelson.id,
    title: "Jay Adelson Wikipedia",
    url: "https://en.wikipedia.org/wiki/Jay_Adelson",
  });

  console.log("Created person: Jay Adelson (with widgets)");

  // ══════════════════════════════════════════════════════
  // COMPANY 3: Bluehost
  // ══════════════════════════════════════════════════════
  let bluehost = (await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "bluehost",
      name: "Bluehost",
      approvalStatus: "approved",
      legalName: "Bluehost, Inc.",
      url: "https://www.bluehost.com",
      blogUrl: "https://www.bluehost.com/blog",
      twitterUsername: "bluehost",
      phone: "+1-801-505-7000",
      email: "support@bluehost.com",
      employees: 1000,
      servers: 25000,
      clients: 2500000,
      foundingDate: "2003",
      companyStatus: "acquired",
      logoUrl: "https://www.google.com/s2/favicons?domain=bluehost.com&sz=128",
      overview:
        "Bluehost is a web hosting company officially recommended by WordPress.org, specializing in WordPress hosting, shared hosting, VPS, and dedicated servers. Founded in 2003 in Utah, Bluehost has grown to serve over 2.5 million customers worldwide.\n\nThe company is known for its WordPress optimization, 24/7 support, automatic WordPress installation, and SEO tools. Bluehost was acquired by Endurance International Group in 2010.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!bluehost) {
    bluehost = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "bluehost")).limit(1)
    )[0];
  }

  if (!bluehost) {
    throw new Error("Failed to create or load Bluehost listing.");
  }

  await db.insert(schema.listingOffices).values({
    listingId: bluehost.id,
    address: "230 W 200 S",
    city: "Salt Lake City",
    state: "UT",
    country: "United States",
    postalCode: "84101",
    isHq: true,
    label: "Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: bluehost.id, name: "Shared Hosting" },
    { listingId: bluehost.id, name: "WordPress Hosting" },
    { listingId: bluehost.id, name: "VPS Hosting" },
    { listingId: bluehost.id, name: "Dedicated Hosting" },
    { listingId: bluehost.id, name: "Domain Name Registration" },
    { listingId: bluehost.id, name: "SSL Certificates" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: bluehost.id, tag: "WordPress Hosting" },
    { listingId: bluehost.id, tag: "Web Hosting" },
    { listingId: bluehost.id, tag: "EIG Portfolio" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: bluehost.id,
      title: "Company Founded",
      description: "Bluehost was founded in Utah as a web hosting provider.",
      date: "2003",
    },
    {
      listingId: bluehost.id,
      title: "WordPress.org Recommendation",
      description: "Bluehost was officially recommended by WordPress.org.",
      date: "2005",
    },
    {
      listingId: bluehost.id,
      title: "Acquired by EIG",
      description: "Endurance International Group acquired Bluehost.",
      date: "2010",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: bluehost.id,
      title: "Bluehost Launches Performance-First WordPress Hosting",
      source: "Bluehost Press",
      date: "2025-07",
    },
  ]);

  console.log("Created company: Bluehost (with widgets)");

  // ══════════════════════════════════════════════════════
  // COMPANY 4: Linode
  // ══════════════════════════════════════════════════════
  let linode = (await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "linode",
      name: "Linode",
      approvalStatus: "approved",
      legalName: "Linode, Inc.",
      url: "https://www.linode.com",
      blogUrl: "https://www.linode.com/blog",
      twitterUsername: "linode",
      phone: "+1-609-380-7100",
      email: "support@linode.com",
      employees: 800,
      servers: 150000,
      clients: 400000,
      foundingDate: "2003",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=linode.com&sz=128",
      overview:
        "Linode is a cloud computing company providing virtual private servers, block storage, managed databases, and distributed DNS services. Founded in 2003 by Christopher Aker, Linode has become a popular choice for developers seeking reliable and affordable cloud infrastructure.\n\nThe company operates 12+ data centers globally and serves over 400,000 customers. Linode is known for its developer-friendly interface, competitive pricing, and strong community.",
      createdById: admin.id,
    })
    .onConflictDoNothing()
    .returning())[0];

  if (!linode) {
    linode = (
      await db.select().from(schema.listings).where(eq(schema.listings.slug, "linode")).limit(1)
    )[0];
  }

  if (!linode) {
    throw new Error("Failed to create or load Linode listing.");
  }

  if (linode?.id) {

  await db.insert(schema.listingOffices).values({
    listingId: linode.id,
    address: "249 Arch Street",
    city: "Philadelphia",
    state: "PA",
    country: "United States",
    postalCode: "19106",
    isHq: true,
    label: "Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: linode.id, name: "Cloud Hosting" },
    { listingId: linode.id, name: "VPS Hosting" },
    { listingId: linode.id, name: "Block Storage" },
    { listingId: linode.id, name: "Managed Databases" },
    { listingId: linode.id, name: "DNS Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: linode.id, tag: "Cloud" },
    { listingId: linode.id, tag: "VPS" },
    { listingId: linode.id, tag: "Developer-Friendly" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: linode.id,
      title: "Company Founded",
      description:
        "Christopher Aker founded Linode to provide affordable cloud computing.",
      date: "2003",
    },
    {
      listingId: linode.id,
      title: "Series A Funding",
      description: "Linode raised Series A funding to expand operations.",
      date: "2018",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: linode.id,
      title: "Linode Launches New GPU-Powered Compute Instances",
      source: "Linode Blog",
      date: "2025-09",
    },
  ]);

  console.log("Created company: Linode (with widgets)");
  } else {
    console.log("Linode already exists, skipping widgets.");
  }

  // ══════════════════════════════════════════════════════
  // COMPANY 5: SiteGround
  // ══════════════════════════════════════════════════════
  const [siteground] = (await db
    .insert(schema.listings)
    .values({
      category: "company",
      slug: "siteground",
      name: "SiteGround",
      approvalStatus: "approved",
      legalName: "SiteGround, Inc.",
      url: "https://www.siteground.com",
      blogUrl: "https://www.siteground.com/blog",
      twitterUsername: "siteground",
      email: "info@siteground.com",
      employees: 1500,
      clients: 2000000,
      foundingDate: "2004",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=siteground.com&sz=128",
      overview:
        "SiteGround is a web hosting company headquartered in Sofia, Bulgaria, with offices worldwide. Founded in 2004, SiteGround specializes in shared hosting, cloud hosting, WordPress hosting, and dedicated servers.\n\nKnown for its customer support, performance optimization, and array of security features, SiteGround serves over 2 million customers worldwide. The company is a official recommended partner of WordPress.org, Drupal, and WooCommerce.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingOffices).values([
    {
      listingId: siteground.id,
      address: "Hristo Botev 68, Sofia",
      city: "Sofia",
      state: "",
      country: "Bulgaria",
      postalCode: "1000",
      isHq: true,
      label: "Global Headquarters",
    },
    {
      listingId: siteground.id,
      address: "110 N 5th St",
      city: "Brooklyn",
      state: "NY",
      country: "United States",
      postalCode: "11249",
      isHq: false,
      label: "US Office",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: siteground.id, name: "Shared Hosting" },
    { listingId: siteground.id, name: "Cloud Hosting" },
    { listingId: siteground.id, name: "WordPress Hosting" },
    { listingId: siteground.id, name: "Dedicated Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: siteground.id, tag: "Web Hosting" },
    { listingId: siteground.id, tag: "Security" },
    { listingId: siteground.id, tag: "Global Support" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: siteground.id,
      title: "Company Founded",
      description: "SiteGround was founded in Bulgaria.",
      date: "2004",
    },
    {
      listingId: siteground.id,
      title: "Series A Funding",
      description: "SiteGround received significant Series A funding.",
      date: "2019",
    },
  ]);

  console.log("Created company: SiteGround (with widgets)");

  // ══════════════════════════════════════════════════════
  // DATACENTER 3: Vultr
  // ══════════════════════════════════════════════════════
  const [vultr] = (await db
    .insert(schema.listings)
    .values({
      category: "datacenter",
      slug: "vultr",
      name: "Vultr",
      approvalStatus: "approved",
      legalName: "Vultr Holdings, Inc.",
      url: "https://www.vultr.com",
      blogUrl: "https://www.vultr.com/blog",
      twitterUsername: "vultr",
      phone: "+1-770-325-8128",
      email: "support@vultr.com",
      employees: 300,
      numberOfDatacenters: 32,
      foundingDate: "2014",
      companyStatus: "publicly_held",
      stockTicker: "VLTR",
      logoUrl: "https://www.google.com/s2/favicons?domain=vultr.com&sz=128",
      overview:
        "Vultr is a cloud infrastructure provider with 32 data center locations worldwide. Founded in 2014, Vultr provides cloud computing, bare metal servers, GPU computing, and storage solutions.\n\nVultr went public via SPAC merger in 2023. The company is known for its global presence, competitive pricing, and developer-friendly API.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingOffices).values({
    listingId: vultr.id,
    address: "770 Parkside Drive",
    city: "Smyrna",
    state: "GA",
    country: "United States",
    postalCode: "30082",
    isHq: true,
    label: "Global Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: vultr.id, name: "Cloud Hosting" },
    { listingId: vultr.id, name: "Bare Metal" },
    { listingId: vultr.id, name: "GPU Computing" },
    { listingId: vultr.id, name: "Block Storage" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: vultr.id, tag: "Cloud" },
    { listingId: vultr.id, tag: "Global DC" },
    { listingId: vultr.id, tag: "Developer Tools" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: vultr.id,
      title: "Company Founded",
      description: "Vultr was founded to provide global cloud infrastructure.",
      date: "2014",
    },
    {
      listingId: vultr.id,
      title: "IPO via SPAC",
      description: "Vultr went public through SPAC merger.",
      date: "2023-03",
    },
  ]);

  await db.insert(schema.listingNews).values([
    {
      listingId: vultr.id,
      title: "Vultr Expands to 32 Global Data Centers",
      source: "Vultr Press",
      date: "2025-10",
    },
  ]);

  console.log("Created datacenter: Vultr (with widgets)");

  // ══════════════════════════════════════════════════════
  // DATACENTER 4: Switch & Data Facilities
  // ══════════════════════════════════════════════════════
  const [switch_] = (await db
    .insert(schema.listings)
    .values({
      category: "datacenter",
      slug: "switch-data-facilities",
      name: "Switch & Data Facilities",
      approvalStatus: "approved",
      legalName: "Switch & Data Facilities, Inc.",
      url: "https://www.switch.com",
      blogUrl: "https://www.switch.com/blog",
      twitterUsername: "switch",
      phone: "+1-702-679-6666",
      email: "sales@switch.com",
      employees: 2000,
      numberOfDatacenters: 4,
      totalSquareFootage: "1.75 million sq ft",
      foundingDate: "2003",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=switch.com&sz=128",
      overview:
        "Switch & Data Facilities (Switch) is a data center operator headquartered in Las Vegas, Nevada. Founded in 2003, Switch operates flagship SuperNAP data centers designed for optimal efficiency and performance.\n\nSwitch specializes in providing high-performance data center solutions for hyperscalers, media companies, and enterprises. The company is known for its cutting-edge facilities and innovative approach to data center design.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingOffices).values({
    listingId: switch_.id,
    address: "7 Racetrack Road",
    city: "Las Vegas",
    state: "NV",
    country: "United States",
    postalCode: "89014",
    isHq: true,
    label: "Global Headquarters",
  });

  await db.insert(schema.listingProducts).values([
    { listingId: switch_.id, name: "Colocation" },
    { listingId: switch_.id, name: "Cloud Hosting" },
    { listingId: switch_.id, name: "Dedicated Hosting" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: switch_.id, tag: "Hyperscale" },
    { listingId: switch_.id, tag: "Las Vegas" },
    { listingId: switch_.id, tag: "Enterprise" },
  ]);

  console.log("Created datacenter: Switch & Data Facilities (with widgets)");

  // ══════════════════════════════════════════════════════
  // REGISTRAR 3: Hover
  // ══════════════════════════════════════════════════════
  const [hover] = (await db
    .insert(schema.listings)
    .values({
      category: "registrar",
      slug: "hover",
      name: "Hover",
      approvalStatus: "approved",
      legalName: "Hover, Inc.",
      url: "https://www.hover.com",
      blogUrl: "https://www.hover.com/blog",
      twitterUsername: "hoverdotcom",
      email: "support@hover.com",
      employees: 150,
      domainsManaged: 3000000,
      foundingDate: "2008",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=hover.com&sz=128",
      overview:
        "Hover is a domain registrar owned by Tucows Inc., designed for simplicity and customer experience. Founded in 2008, Hover aims to make domain registration straightforward and transparent.\n\nKnown for its clean interface, no upsells, and excellent customer service, Hover manages over 3 million domain names. The company focuses on making domain registration simple without unnecessary add-ons.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingProducts).values([
    { listingId: hover.id, name: "Domain Name Registration" },
    { listingId: hover.id, name: "Private Whois" },
    { listingId: hover.id, name: "DNS Hosting" },
    { listingId: hover.id, name: "Email Forwarding" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: hover.id, tag: "Domain Registrar" },
    { listingId: hover.id, tag: "Simple" },
    { listingId: hover.id, tag: "No Upsells" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: hover.id,
      title: "Company Founded",
      description: "Hover was founded to simplify domain registration.",
      date: "2008",
    },
  ]);

  console.log("Created registrar: Hover (with widgets)");

  // ══════════════════════════════════════════════════════
  // REGISTRAR 4: Domain.com
  // ══════════════════════════════════════════════════════
  const [domain_com] = (await db
    .insert(schema.listings)
    .values({
      category: "registrar",
      slug: "domain-com",
      name: "Domain.com",
      approvalStatus: "approved",
      legalName: "Domain.com, Inc.",
      url: "https://www.domain.com",
      twitterUsername: "domain",
      email: "support@domain.com",
      employees: 200,
      domainsManaged: 5000000,
      foundingDate: "2000",
      companyStatus: "privately_held",
      logoUrl: "https://www.google.com/s2/favicons?domain=domain.com&sz=128",
      overview:
        "Domain.com is a domain registrar and web hosting provider founded in 2000. The company offers domain registration, web hosting, email, SSL certificates, and website builders.\n\nDomain.com manages over 5 million domain names and serves customers worldwide with affordable pricing and reliable service.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingProducts).values([
    { listingId: domain_com.id, name: "Domain Name Registration" },
    { listingId: domain_com.id, name: "Web Hosting" },
    { listingId: domain_com.id, name: "Email Hosting" },
    { listingId: domain_com.id, name: "SSL Certificates" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: domain_com.id, tag: "Domain Registrar" },
    { listingId: domain_com.id, tag: "Web Hosting" },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: domain_com.id,
      title: "Company Founded",
      description: "Domain.com was founded as a domain registrar.",
      date: "2000",
    },
  ]);

  console.log("Created registrar: Domain.com (with widgets)");

  // ══════════════════════════════════════════════════════
  // PERSON 4: Steve Jones (Tech CEO)
  // ══════════════════════════════════════════════════════
  const [steveJones] = (await db
    .insert(schema.listings)
    .values({
      category: "person",
      slug: "steve-jones",
      name: "Steve Jones",
      approvalStatus: "approved",
      firstName: "Steve",
      lastName: "Jones",
      homepageUrl: "https://stevejones.dev",
      twitterUsername: "stevejones_dev",
      linkedinUrl: "https://www.linkedin.com/in/stevejones",
      birthplace: "California, USA",
      photoUrl: "https://ui-avatars.com/api/?name=Steve+Jones&size=256&background=ef4444&color=fff",
      overview:
        "Steve Jones is a technology entrepreneur and venture capitalist focused on cloud infrastructure investments. He has served as advisor to multiple hosting and cloud companies.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.listingMilestones).values([
    {
      listingId: steveJones.id,
      title: "Founded Tech Ventures",
      description: "Started investment firm focused on infrastructure.",
      date: "2015",
    },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: steveJones.id, tag: "VC" },
    { listingId: steveJones.id, tag: "Cloud" },
    { listingId: steveJones.id, tag: "Infrastructure" },
  ]);

  console.log("Created person: Steve Jones (with widgets)");

  // ══════════════════════════════════════════════════════
  // PERSON 5: Sarah Chen (Data Center Architect)
  // ══════════════════════════════════════════════════════
  const [sarahChen] = (await db
    .insert(schema.listings)
    .values({
      category: "person",
      slug: "sarah-chen",
      name: "Sarah Chen",
      approvalStatus: "approved",
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah@datacenter.tech",
      twitterUsername: "sarahchendc",
      linkedinUrl: "https://www.linkedin.com/in/sarahchen",
      birthplace: "Singapore",
      photoUrl: "https://ui-avatars.com/api/?name=Sarah+Chen&size=256&background=06b6d4&color=fff",
      overview:
        "Sarah Chen is a renowned data center architect and designer. She has worked on the design of multiple large-scale data center facilities across Asia-Pacific.",
      createdById: admin.id,
    })
    .returning());

  await db.insert(schema.personDegrees).values([
    {
      listingId: sarahChen.id,
      institution: "National University of Singapore",
      subject: "Civil & Electrical Engineering",
      degreeType: "M.S.",
      graduationYear: "2008",
    },
  ]);

  await db.insert(schema.listingMilestones).values([
    {
      listingId: sarahChen.id,
      title: "Data Center Design Lead",
      description: "Led design of major data center facilities.",
      date: "2015",
    },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: sarahChen.id, tag: "Infrastructure" },
    { listingId: sarahChen.id, tag: "Architecture" },
    { listingId: sarahChen.id, tag: "Asia-Pacific" },
  ]);

  console.log("Created person: Sarah Chen (with widgets)");

  // ══════════════════════════════════════════════════════
  // Link listings together
  // ══════════════════════════════════════════════════════

  // Link Brent Oxley person to HostGator listing
  await db
    .insert(schema.listingPeople)
    .values({
      listingId: hostgator.id,
      personListingId: brentOxley.id,
      name: "Brent Oxley",
      title: "Founder",
      role: "Founder",
    })
    .onConflictDoNothing();

  // Link Jay Adelson person to Equinix listing
  await db
    .insert(schema.listingPeople)
    .values({
      listingId: equinix.id,
      personListingId: jayAdelson.id,
      name: "Jay Adelson",
      title: "Co-Founder",
      role: "Founder",
    })
    .onConflictDoNothing();

  // Link HostGator to Equinix datacenter
  await db.insert(schema.listingDatacenterLinks).values({
    listingId: hostgator.id,
    datacenterListingId: equinix.id,
    datacenterName: "Equinix",
  });

  // Link DigitalOcean to Equinix datacenter
  await db.insert(schema.listingDatacenterLinks).values({
    listingId: digitalocean.id,
    datacenterListingId: equinix.id,
    datacenterName: "Equinix",
  });

  console.log("Linked listings together");

  // ══════════════════════════════════════════════════════
  console.log("\nSeed completed successfully!");
  console.log("  5 Companies: HostGator, DigitalOcean, Bluehost, Linode, SiteGround");
  console.log("  4 Data Centers: Equinix, CoreSite, Vultr, Switch & Data Facilities");
  console.log("  4 Registrars: Namecheap, GoDaddy, Hover, Domain.com");
  console.log("  5 People: Brent Oxley, Richard Kirkendall, Jay Adelson, Steve Jones, Sarah Chen");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
