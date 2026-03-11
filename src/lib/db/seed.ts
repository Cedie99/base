import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // ── Users ──────────────────────────────────────────────
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

  const modPassword = await bcrypt.hash("mod12345", 10);
  await db.insert(schema.users).values({
    name: "Moderator User",
    email: "mod@base.com",
    password: modPassword,
    role: "moderator",
  });
  console.log("Created moderator user: mod@base.com / mod12345");

  const userPassword = await bcrypt.hash("user1234", 10);
  await db.insert(schema.users).values({
    name: "Regular User",
    email: "user@base.com",
    password: userPassword,
    role: "user",
  });
  console.log("Created regular user: user@base.com / user1234");

  // ══════════════════════════════════════════════════════
  // COMPANY 1: HostGator
  // ══════════════════════════════════════════════════════
  const [hostgator] = await db
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
    .returning();

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
  const [digitalocean] = await db
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
    .returning();

  await db.insert(schema.listingOffices).values([
    {
      listingId: digitalocean.id,
      address: "101 6th Avenue",
      city: "New York",
      state: "NY",
      country: "United States",
      postalCode: "10013",
      isHq: true,
      label: "NYC Headquarters",
    },
    {
      listingId: digitalocean.id,
      address: "83 Cambridge St",
      city: "Cambridge",
      state: "MA",
      country: "United States",
      postalCode: "02141",
      isHq: false,
      label: "Cambridge Engineering Office",
    },
    {
      listingId: digitalocean.id,
      address: "RMZ Infinity Tower B, Old Madras Road",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      postalCode: "560016",
      isHq: false,
      label: "Bengaluru Office",
    },
  ]);

  await db.insert(schema.listingProducts).values([
    { listingId: digitalocean.id, name: "Cloud Hosting" },
    { listingId: digitalocean.id, name: "VPS Hosting" },
    { listingId: digitalocean.id, name: "Dedicated Hosting" },
    { listingId: digitalocean.id, name: "E-Mail Hosting" },
    { listingId: digitalocean.id, name: "Domain Name Registration" },
    { listingId: digitalocean.id, name: "Backup Service" },
  ]);

  await db.insert(schema.listingTags).values([
    { listingId: digitalocean.id, tag: "Cloud" },
    { listingId: digitalocean.id, tag: "Developer Tools" },
    { listingId: digitalocean.id, tag: "Kubernetes" },
    { listingId: digitalocean.id, tag: "IaaS" },
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

  // ══════════════════════════════════════════════════════
  // DATACENTER 1: Equinix
  // ══════════════════════════════════════════════════════
  const [equinix] = await db
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
    .returning();

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

  // ══════════════════════════════════════════════════════
  // DATACENTER 2: CoreSite
  // ══════════════════════════════════════════════════════
  const [coresite] = await db
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
    .returning();

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

  // ══════════════════════════════════════════════════════
  // REGISTRAR 1: Namecheap
  // ══════════════════════════════════════════════════════
  const [namecheap] = await db
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
    .returning();

  await db.insert(schema.listingOffices).values([
    {
      listingId: namecheap.id,
      address: "4600 E Washington St, Suite 305",
      city: "Phoenix",
      state: "AZ",
      country: "United States",
      postalCode: "85034",
      isHq: true,
      label: "US Headquarters",
    },
    {
      listingId: namecheap.id,
      address: "Khreshchatyk Street 22",
      city: "Kyiv",
      state: "",
      country: "Ukraine",
      postalCode: "01001",
      isHq: false,
      label: "Kyiv Office",
    },
  ]);

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
  const [godaddy] = await db
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
    .returning();

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
  const [brentOxley] = await db
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
    .returning();

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
  const [richardK] = await db
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
    .returning();

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
  const [jayAdelson] = await db
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
    .returning();

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
  console.log("  2 Companies: HostGator, DigitalOcean");
  console.log("  2 Data Centers: Equinix, CoreSite");
  console.log("  2 Registrars: Namecheap, GoDaddy");
  console.log("  3 People: Brent Oxley, Richard Kirkendall, Jay Adelson");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
