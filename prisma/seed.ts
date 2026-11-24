// ==============================================================================
// OPMAINT CMMS - REALISTIC INDUSTRIAL SEED SCRIPT
// Creates: 4 Users (All Roles), 2 Plants, 5 Areas, 6 Critical Equipment,
// and 10 Real-world Permits spread across all lifecycle states.
// ==============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Opmaint PTW Database Seeding...");

  // 1. Clean existing records in referential integrity order
  await prisma.permitAuditLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.permit.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.area.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.user.deleteMany();

  // Common secure hashed password for demo users
  const hashedPassword = await bcrypt.hash("Opmaint@123", 10);

  // 2. Create 4 Users (One per role)
  console.log("👤 Provisioning 4 Core Users...");
  const requester = await prisma.user.create({
    data: {
      id: "user-req-1",
      email: "requester@opmaint.com",
      passwordHash: hashedPassword,
      name: "Murugan Technician",
      role: "REQUESTER",
      department: "Mechanical Maintenance",
    },
  });

  const areaOwner = await prisma.user.create({
    data: {
      id: "user-ao-1",
      email: "areaowner@opmaint.com",
      passwordHash: hashedPassword,
      name: "Karthik Area Owner",
      role: "AREA_OWNER",
      department: "Plant Production & Utilities",
    },
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      id: "user-so-1",
      email: "safety@opmaint.com",
      passwordHash: hashedPassword,
      name: "Suresh Safety Officer",
      role: "SAFETY_OFFICER",
      department: "Environment, Health & Safety (EHS)",
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: "user-adm-1",
      email: "admin@opmaint.com",
      passwordHash: hashedPassword,
      name: "Anand Admin",
      role: "ADMIN",
      department: "Plant Operations Management",
    },
  });

  // 3. Create 2 Industrial Plants
  console.log("🏭 Creating 2 Manufacturing Plants...");
  const plantAlpha = await prisma.plant.create({
    data: {
      id: "plant-1",
      name: "Chennai Automotive Assembly Plant",
      code: "PLANT-CHE-01",
      location: "Oragadam Industrial Corridor, Chennai",
    },
  });

  const plantBeta = await prisma.plant.create({
    data: {
      id: "plant-2",
      name: "Sriperumbudur Metal Stamping & Paint Facility",
      code: "PLANT-SRP-02",
      location: "SIPCOT Industrial Park, Sriperumbudur",
    },
  });

  // 4. Create Plant Areas (Assigning Area Owner Karthik to high-hazard boiler & chemical areas)
  console.log("📍 Establishing Plant Areas...");
  const areaBoiler = await prisma.area.create({
    data: {
      id: "area-boiler",
      name: "High Pressure Boiler & Steam Room",
      plantId: plantAlpha.id,
      ownerId: areaOwner.id,
    },
  });

  const areaChemical = await prisma.area.create({
    data: {
      id: "area-chemical",
      name: "Solvent & Chemical Storage Yard",
      plantId: plantAlpha.id,
      ownerId: areaOwner.id,
    },
  });

  const areaETP = await prisma.area.create({
    data: {
      id: "area-etp",
      name: "Effluent Treatment Plant (ETP)",
      plantId: plantAlpha.id,
      ownerId: null,
    },
  });

  const areaAssembly = await prisma.area.create({
    data: {
      id: "area-assembly",
      name: "Robotic Assembly Bay 3",
      plantId: plantBeta.id,
      ownerId: null,
    },
  });

  const areaSubstation = await prisma.area.create({
    data: {
      id: "area-substation",
      name: "11kV High Voltage Substation",
      plantId: plantBeta.id,
      ownerId: null,
    },
  });

  // 5. Create 6 Critical Equipment Items
  console.log("⚙️ Registering 6 Industrial Equipment Assets...");
  const eqBoiler = await prisma.equipment.create({
    data: {
      id: "eq-blr-01",
      tag: "EQ-BLR-01",
      name: "High-Pressure Steam Boiler Unit 1",
      areaId: areaBoiler.id,
    },
  });

  const eqPump = await prisma.equipment.create({
    data: {
      id: "eq-pmp-02",
      tag: "EQ-PMP-02",
      name: "Flammable Solvent Transfer Pump 2",
      areaId: areaChemical.id,
    },
  });

  const eqTank = await prisma.equipment.create({
    data: {
      id: "eq-tnk-03",
      tag: "EQ-TNK-03",
      name: "Underground Sludge Digester Tank",
      areaId: areaETP.id,
    },
  });

  const eqConveyor = await prisma.equipment.create({
    data: {
      id: "eq-conv-04",
      tag: "EQ-CONV-04",
      name: "Overhead High-Bay Conveyor Line B",
      areaId: areaAssembly.id,
    },
  });

  const eqTransformer = await prisma.equipment.create({
    data: {
      id: "eq-trn-05",
      tag: "EQ-TRN-05",
      name: "11kV Main Step-down Transformer",
      areaId: areaSubstation.id,
    },
  });

  const eqRobot = await prisma.equipment.create({
    data: {
      id: "eq-rob-06",
      tag: "EQ-ROB-06",
      name: "Robotic Spot Welding Cell 4",
      areaId: areaAssembly.id,
    },
  });

  // Helper date generators
  const now = new Date();
  const hoursFromNow = (h: number) => new Date(now.getTime() + h * 3600 * 1000);
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000);

  // 6. Create 10 Permits Across Different Statuses
  console.log("📋 Populating 10 Realistic Permits Across Lifecycle States...");

  // Permit 1: DRAFT (Hot Work - Steam line pipe rack)
  await prisma.permit.create({
    data: {
      id: "p1",
      permitNumber: "PTW-2026-0001",
      type: "HOT_WORK",
      status: "DRAFT",
      requesterId: requester.id,
      contractorName: "Delta Industrial Welders",
      workDescription: "Welding support bracket onto main steam pipe rack",
      plantId: plantAlpha.id,
      areaId: areaBoiler.id,
      equipmentId: eqBoiler.id,
      plannedStartTime: hoursFromNow(2),
      plannedEndTime: hoursFromNow(6),
      hazardsIdentified: JSON.stringify(["Flammable Gas / Vapour", "Open Flame / Sparks", "High Heat"]),
      ppeRequired: JSON.stringify(["Welding Helmet", "Leather Gloves", "Flame Retardant Coverall", "Safety Boots"]),
      precautionsChecklist: JSON.stringify([
        { item: "Combustibles cleared within 10 meters", checked: true },
        { item: "Fire extinguisher (CO2 / Dry Powder) positioned", checked: true },
        { item: "Fire watch personnel assigned", checked: false },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: "welding",
        fireWatchAssigned: "Vignesh Kumar",
        fireExtinguisherType: "CO2 + DCP 9kg",
        combustiblesClearedRadiusMeters: 12,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: now.toISOString(),
          testedBy: "Murugan Technician",
        },
      }),
      auditLogs: {
        create: [
          {
            action: "CREATED",
            performedById: requester.id,
            fromStatus: null,
            toStatus: "DRAFT",
            comment: "Initial permit draft saved by technician.",
          },
        ],
      },
    },
  });

  // Permit 2: PENDING_APPROVAL (Confined Space - Sludge Tank)
  await prisma.permit.create({
    data: {
      id: "p2",
      permitNumber: "PTW-2026-0002",
      type: "CONFINED_SPACE",
      status: "PENDING_APPROVAL",
      requesterId: requester.id,
      contractorName: "EcoClean Industrial Services",
      workDescription: "Deep internal sludge extraction and wall thickness ultrasonic inspection",
      plantId: plantAlpha.id,
      areaId: areaETP.id,
      equipmentId: eqTank.id,
      plannedStartTime: hoursFromNow(1),
      plannedEndTime: hoursFromNow(5),
      hazardsIdentified: JSON.stringify(["Oxygen Deficiency", "Toxic Gas (H2S / CO)", "Engulfment Hazard"]),
      ppeRequired: JSON.stringify(["SCBA Breathing Apparatus", "Full Body Harness with Lifeline", "Continuous Gas Badge"]),
      precautionsChecklist: JSON.stringify([
        { item: "Forced positive ventilation running for > 30 minutes", checked: true },
        { item: "Atmospheric multi-gas detector calibrated", checked: true },
        { item: "Standby attendant posted at manhole entrance", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        spaceId: "ETP-TNK-INT-01",
        entryPoint: "Top Manhole Cover #2",
        standbyAttendantName: "Rajesh Kannan",
        rescuePlan: "Tripod winch with retrieval harness; emergency horn on site",
        ventilationMethod: "Continuous mechanical air blower (3000 CFM)",
        atmosphericTest: {
          o2Percent: 20.8,
          lelPercent: 0,
          h2sPpm: 1.2,
          coPpm: 4.5,
          testTime: now.toISOString(),
          testedBy: "Murugan Technician",
        },
      }),
      approvals: {
        create: [
          {
            approverId: areaOwner.id,
            roleRequired: "AREA_OWNER",
            status: "APPROVED",
            comments: "Plant area cleared for entry. Tank isolated upstream.",
            signedAt: hoursAgo(1),
          },
          {
            approverId: safetyOfficer.id,
            roleRequired: "SAFETY_OFFICER",
            status: "PENDING",
          },
        ],
      },
      auditLogs: {
        create: [
          { action: "CREATED", performedById: requester.id, fromStatus: null, toStatus: "DRAFT", comment: "Permit drafted" },
          { action: "SUBMITTED", performedById: requester.id, fromStatus: "DRAFT", toStatus: "PENDING_APPROVAL", comment: "Submitted for multi-level approvals" },
          { action: "APPROVED", performedById: areaOwner.id, fromStatus: "PENDING_APPROVAL", toStatus: "PENDING_APPROVAL", comment: "Area Owner signed off." },
        ],
      },
    },
  });

  // Permit 3: APPROVED (Working at Height - Conveyor sensor)
  await prisma.permit.create({
    data: {
      id: "p3",
      permitNumber: "PTW-2026-0003",
      type: "WORKING_AT_HEIGHT",
      status: "APPROVED",
      requesterId: requester.id,
      contractorName: "Apex Rigging & Heights",
      workDescription: "High-bay optical sensor replacement on conveyor track",
      plantId: plantBeta.id,
      areaId: areaAssembly.id,
      equipmentId: eqConveyor.id,
      plannedStartTime: hoursFromNow(1), // Starts in 1 hr (can activate soon)
      plannedEndTime: hoursFromNow(5),
      hazardsIdentified: JSON.stringify(["Fall from Elevation (> 6m)", "Dropped Objects / Tools", "Moving Conveyor Parts"]),
      ppeRequired: JSON.stringify(["Double Lanyard Fall Arrest Harness", "Chin Strap Hard Hat", "Tool Lanyards"]),
      precautionsChecklist: JSON.stringify([
        { item: "Scaffolding / MEWP tagged green by competent rigger", checked: true },
        { item: "Lifeline anchor points load-tested and verified", checked: true },
        { item: "Ground zone barricaded with warning tape", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        heightInMeters: 7.5,
        accessMethod: "MEWP",
        fallArrestEquipment: "Double elasticated lanyard with shock absorber",
        anchorPointChecked: true,
        barricadingBelow: true,
      }),
      approvals: {
        create: [
          { approverId: areaOwner.id, roleRequired: "AREA_OWNER", status: "APPROVED", signedAt: hoursAgo(2), comments: "Conveyor interlock locked" },
          { approverId: safetyOfficer.id, roleRequired: "SAFETY_OFFICER", status: "APPROVED", signedAt: hoursAgo(1), comments: "Rigging certified & safety inspection clear." },
        ],
      },
      auditLogs: {
        create: [
          { action: "APPROVED", performedById: safetyOfficer.id, fromStatus: "PENDING_APPROVAL", toStatus: "APPROVED", comment: "All required approvers signed. Ready for work window." },
        ],
      },
    },
  });

  // Permit 4: ACTIVE (Hot Work - Robotic cell guard rail cutting)
  await prisma.permit.create({
    data: {
      id: "p4",
      permitNumber: "PTW-2026-0004",
      type: "HOT_WORK",
      status: "ACTIVE",
      requesterId: requester.id,
      contractorName: "Delta Industrial Welders",
      workDescription: "Oxy-acetylene cutting of damaged safety guard rail",
      plantId: plantBeta.id,
      areaId: areaAssembly.id,
      equipmentId: eqRobot.id,
      plannedStartTime: hoursAgo(2),
      plannedEndTime: hoursFromNow(3),
      actualStartTime: hoursAgo(2),
      hazardsIdentified: JSON.stringify(["Open Flame", "Hot Slag / Flying Sparks"]),
      ppeRequired: JSON.stringify(["Cutting Goggles (Shade 5)", "Heavy Leather Gauntlets", "Leather Apron"]),
      precautionsChecklist: JSON.stringify([
        { item: "Fire blankets shielded over surrounding hydraulic lines", checked: true },
        { item: "Pressurized fire hose run out and pressurized", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: "cutting",
        fireWatchAssigned: "Kishore Kumar",
        fireExtinguisherType: "Dry Chemical Powder 9kg",
        combustiblesClearedRadiusMeters: 15,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: hoursAgo(2).toISOString(),
          testedBy: "Murugan Technician",
        },
      }),
      approvals: {
        create: [
          { approverId: areaOwner.id, roleRequired: "AREA_OWNER", status: "APPROVED", signedAt: hoursAgo(3) },
          { approverId: safetyOfficer.id, roleRequired: "SAFETY_OFFICER", status: "APPROVED", signedAt: hoursAgo(2.5) },
        ],
      },
      auditLogs: {
        create: [
          { action: "ACTIVATED", performedById: requester.id, fromStatus: "APPROVED", toStatus: "ACTIVE", comment: "Hot work cutting started on shop floor." },
        ],
      },
    },
  });

  // Permit 5: ACTIVE - EXPIRING IN ~45 MINUTES (For visible live countdown testing!)
  await prisma.permit.create({
    data: {
      id: "p5",
      permitNumber: "PTW-2026-0005",
      type: "ELECTRICAL_LOTO",
      status: "ACTIVE",
      requesterId: requester.id,
      contractorName: "PowerGrid Industrial Services",
      workDescription: "11kV Busbar primary insulation bushing replacement",
      plantId: plantBeta.id,
      areaId: areaSubstation.id,
      equipmentId: eqTransformer.id,
      plannedStartTime: hoursAgo(3),
      plannedEndTime: new Date(now.getTime() + 45 * 60 * 1000), // Exactly 45 mins left!
      actualStartTime: hoursAgo(3),
      hazardsIdentified: JSON.stringify(["11kV Electrocution", "Arc Flash Hazard", "Stored Inductive Energy"]),
      ppeRequired: JSON.stringify(["40 cal/cm2 Arc Flash Suit", "Class 4 Insulating Gloves (36kV rated)", "Dielectric Safety Shoes"]),
      precautionsChecklist: JSON.stringify([
        { item: "Main 11kV Incomer Breaker racked out and padlocked", checked: true },
        { item: "Certified potential tester used to prove dead", checked: true },
        { item: "Portable earthing clusters applied on busbars", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        equipmentTag: "EQ-TRN-05",
        voltageLevel: "11,000V (11kV)",
        isolationPointsList: [
          { point: "Incomer Circuit Breaker VCB-01", method: "Racked Out & Padlocked" },
          { point: "Feeder Isolator ISO-11A", method: "Locked Open" },
        ],
        lockNumbers: ["LOTO-RED-8821", "LOTO-RED-8822"],
        tagNumbers: ["TAG-DANGER-4091", "TAG-DANGER-4092"],
        earthingApplied: true,
        testedDeadBy: "Murugan Technician",
      }),
      approvals: {
        create: [
          { approverId: areaOwner.id, roleRequired: "AREA_OWNER", status: "APPROVED", signedAt: hoursAgo(4) },
          { approverId: safetyOfficer.id, roleRequired: "SAFETY_OFFICER", status: "APPROVED", signedAt: hoursAgo(3.5) },
        ],
      },
      auditLogs: {
        create: [
          { action: "ACTIVATED", performedById: requester.id, fromStatus: "APPROVED", toStatus: "ACTIVE", comment: "Substation isolated and busbar work began." },
        ],
      },
    },
  });

  // Permit 6: SUSPENDED (Confined Space - Gas alarm triggered during inspection!)
  await prisma.permit.create({
    data: {
      id: "p6",
      permitNumber: "PTW-2026-0006",
      type: "CONFINED_SPACE",
      status: "SUSPENDED",
      requesterId: requester.id,
      contractorName: "VapourSafe Tech",
      workDescription: "Solvent line inspection inside containment trench",
      plantId: plantAlpha.id,
      areaId: areaChemical.id,
      equipmentId: eqPump.id,
      plannedStartTime: hoursAgo(4),
      plannedEndTime: hoursFromNow(2),
      actualStartTime: hoursAgo(4),
      suspensionReason: "EMERGENCY WORK STOP: Flammable solvent LEL reading spiked to 18% in trench. Immediate evacuation ordered by Safety Officer.",
      hazardsIdentified: JSON.stringify(["Flammable Vapour", "Asphyxiation Hazard"]),
      ppeRequired: JSON.stringify(["Continuous 4-Gas Monitor", "Full Face Respirator with ABEK Filter"]),
      precautionsChecklist: JSON.stringify([
        { item: "Intrinsically safe lighting only", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        spaceId: "CHEM-TRENCH-04",
        entryPoint: "East Grating Manhole",
        standbyAttendantName: "Dinesh Babu",
        rescuePlan: "Lifeline retrieval system",
        ventilationMethod: "Air mover pneumatic blower",
        atmosphericTest: {
          o2Percent: 19.5,
          lelPercent: 18.0, // Spike caused suspension
          h2sPpm: 0,
          coPpm: 12,
          testTime: hoursAgo(1).toISOString(),
          testedBy: "Suresh Safety Officer",
        },
      }),
      approvals: {
        create: [
          { approverId: areaOwner.id, roleRequired: "AREA_OWNER", status: "APPROVED", signedAt: hoursAgo(5) },
          { approverId: safetyOfficer.id, roleRequired: "SAFETY_OFFICER", status: "APPROVED", signedAt: hoursAgo(4.5) },
        ],
      },
      auditLogs: {
        create: [
          { action: "ACTIVATED", performedById: requester.id, fromStatus: "APPROVED", toStatus: "ACTIVE", comment: "Trench entry initiated." },
          { action: "SUSPENDED", performedById: safetyOfficer.id, fromStatus: "ACTIVE", toStatus: "SUSPENDED", comment: "Emergency Stop: LEL spiked to 18%. Halted immediately." },
        ],
      },
    },
  });

  // Permit 7: CLOSED (Hot Work - Grinding finished, awaiting Safety Officer Verification)
  await prisma.permit.create({
    data: {
      id: "p7",
      permitNumber: "PTW-2026-0007",
      type: "HOT_WORK",
      status: "CLOSED",
      requesterId: requester.id,
      contractorName: "Delta Industrial Welders",
      workDescription: "Grinding of weld seams on structural floor beams",
      plantId: plantAlpha.id,
      areaId: areaBoiler.id,
      equipmentId: eqBoiler.id,
      plannedStartTime: hoursAgo(5),
      plannedEndTime: hoursAgo(1),
      actualStartTime: hoursAgo(5),
      actualEndTime: hoursAgo(1),
      closureNotes: "Grinding complete. Mandatory 30-minute post-work fire watch observed. Zero smoldering embers. Tools packed away.",
      hazardsIdentified: JSON.stringify(["Sparks", "High Noise"]),
      ppeRequired: JSON.stringify(["Face Shield", "Ear Defenders", "Safety Goggles"]),
      precautionsChecklist: JSON.stringify([
        { item: "Combustibles shielded", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: "grinding",
        fireWatchAssigned: "Vignesh Kumar",
        fireExtinguisherType: "CO2 4.5kg",
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: hoursAgo(5).toISOString(),
          testedBy: "Murugan Technician",
        },
      }),
      auditLogs: {
        create: [
          { action: "CLOSED", performedById: requester.id, fromStatus: "ACTIVE", toStatus: "CLOSED", comment: "Technician finished work and requested closure." },
        ],
      },
    },
  });

  // Permit 8: CLOSED_VERIFIED (Electrical LOTO - Verified clean & de-isolated by Safety Officer)
  await prisma.permit.create({
    data: {
      id: "p8",
      permitNumber: "PTW-2026-0008",
      type: "ELECTRICAL_LOTO",
      status: "CLOSED_VERIFIED",
      requesterId: requester.id,
      contractorName: "PowerGrid Industrial Services",
      workDescription: "Auxiliary motor winding insulation resistance test",
      plantId: plantAlpha.id,
      areaId: areaChemical.id,
      equipmentId: eqPump.id,
      plannedStartTime: hoursAgo(8),
      plannedEndTime: hoursAgo(3),
      actualStartTime: hoursAgo(8),
      actualEndTime: hoursAgo(3),
      closureNotes: "Megger insulation testing completed (500M Ohm reading). Padlocks removed.",
      verificationNotes: "Safety Officer physically inspected site. All temporary earthing removed, locks returned to lockbox, MCC cabinet locked. Cleared for re-energization.",
      hazardsIdentified: JSON.stringify(["Electric Shock"]),
      ppeRequired: JSON.stringify(["1000V Insulated Gloves", "Safety Boots"]),
      precautionsChecklist: JSON.stringify([
        { item: "Motor disconnect open and locked", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        equipmentTag: "EQ-PMP-02",
        voltageLevel: "415V 3-Phase",
        isolationPointsList: [{ point: "MCC Feeder C-12", method: "Breaker locked open" }],
        lockNumbers: ["LOTO-BLU-102"],
        tagNumbers: ["TAG-WARNING-551"],
        earthingApplied: false,
        testedDeadBy: "Murugan Technician",
      }),
      auditLogs: {
        create: [
          { action: "CLOSED", performedById: requester.id, fromStatus: "ACTIVE", toStatus: "CLOSED", comment: "Work finished." },
          { action: "VERIFIED", performedById: safetyOfficer.id, fromStatus: "CLOSED", toStatus: "CLOSED_VERIFIED", comment: "Safety Officer physically inspected site and finalized closure verification." },
        ],
      },
    },
  });

  // Permit 9: REJECTED (Working at Height - 12m ladder rejected with mandatory reason)
  await prisma.permit.create({
    data: {
      id: "p9",
      permitNumber: "PTW-2026-0009",
      type: "WORKING_AT_HEIGHT",
      status: "REJECTED",
      requesterId: requester.id,
      contractorName: "Apex Rigging & Heights",
      workDescription: "Exhaust duct louvre flap lubrication at 12m height",
      plantId: plantAlpha.id,
      areaId: areaBoiler.id,
      equipmentId: eqBoiler.id,
      plannedStartTime: hoursAgo(10),
      plannedEndTime: hoursAgo(6),
      rejectionReason: "MANDATORY REJECTION: Proposed ladder access exceeds 9m without intermediate landing or certified vertical lifeline cable. Resubmit with boom lift (MEWP) plan.",
      hazardsIdentified: JSON.stringify(["Severe Fall Hazard (>10m)"]),
      ppeRequired: JSON.stringify(["Full Body Harness"]),
      precautionsChecklist: JSON.stringify([
        { item: "Ladder tied off", checked: false },
      ]),
      typeSpecificData: JSON.stringify({
        heightInMeters: 12.0,
        accessMethod: "ladder",
        fallArrestEquipment: "Single rope grab",
        anchorPointChecked: false,
        barricadingBelow: false,
      }),
      auditLogs: {
        create: [
          { action: "REJECTED", performedById: safetyOfficer.id, fromStatus: "PENDING_APPROVAL", toStatus: "REJECTED", comment: "Unsafe method of access for height > 9m. Boom lift required." },
        ],
      },
    },
  });

  // Permit 10: EXPIRED (Hot Work - Shift validity ended yesterday)
  await prisma.permit.create({
    data: {
      id: "p10",
      permitNumber: "PTW-2026-0010",
      type: "HOT_WORK",
      status: "EXPIRED",
      requesterId: requester.id,
      contractorName: "Delta Industrial Welders",
      workDescription: "Tack welding temporary pipe alignment clamps",
      plantId: plantBeta.id,
      areaId: areaAssembly.id,
      equipmentId: eqRobot.id,
      plannedStartTime: hoursAgo(28),
      plannedEndTime: hoursAgo(22),
      hazardsIdentified: JSON.stringify(["Sparks"]),
      ppeRequired: JSON.stringify(["Safety Goggles"]),
      precautionsChecklist: JSON.stringify([
        { item: "Combustibles cleared", checked: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: "welding",
        fireWatchAssigned: "Vignesh Kumar",
        fireExtinguisherType: "CO2",
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: hoursAgo(28).toISOString(),
          testedBy: "Murugan Technician",
        },
      }),
      auditLogs: {
        create: [
          { action: "EXPIRED", performedById: admin.id, fromStatus: "ACTIVE", toStatus: "EXPIRED", comment: "Shift validity window ended. System auto-expired the permit." },
        ],
      },
    },
  });

  console.log("✅ Seed complete! 4 users, 2 plants, 5 areas, 6 equipment, and 10 permits ready in database.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
