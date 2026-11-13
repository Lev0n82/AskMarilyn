import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock, User, Activity, Pill, Calendar } from "lucide-react";
import { MicroQuiz } from "@/components/MicroQuiz";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function FHIRResources() {
  usePageMeta({
    title: "Healthcare IT - FHIR Resources",
    description: "Educational module on FHIR resource types and healthcare data exchange. Part of GRACE Academy curriculum.",
    keywords: "FHIR resources education, healthcare interoperability, health informatics course, GRACE Academy"
  });

  return (
    <Layout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Header */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/healthcare-architect">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Healthcare Architect
              </Button>
            </Link>
            <span>/</span>
            <span>Module 2</span>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-primary">
            FHIR Resources: The Building Blocks of Healthcare Data
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~15 min read
            </span>
          </div>
        </section>

        {/* Hero Image */}
        <section>
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/LpaeWeeVINZDMjjl.jpg" 
            alt="FHIR Resources - Building blocks of healthcare data"
            className="w-full rounded-xl border border-border shadow-lg"
          />
        </section>

        {/* Reader's Dilemma */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Reader's Dilemma
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border paper-shadow relative">
            <div className="absolute -left-3 top-6 w-6 h-6 bg-accent rotate-45"></div>
            <p className="font-sans text-card-foreground leading-relaxed">
              <span className="font-bold block mb-2">Dear Marilyn,</span>
              I keep hearing about FHIR "resources" but I'm confused. There are over 150 of them! How do I know which ones to use? And how do they connect to each other? It feels like I need a PhD just to understand a patient record.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-primary">Marilyn's Reply</h3>
            <p className="font-sans leading-relaxed">
              <span className="drop-cap">D</span>on't be overwhelmed by the number. Think of FHIR resources like LEGO blocks. Yes, there are thousands of different LEGO pieces, but most creations use only a handful of common ones. In healthcare, about 80% of your work will involve just 10-15 core resources.
            </p>
          </div>
        </section>

        {/* The Spark - Core Content */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Spark: Understanding Core FHIR Resources
          </h2>

          {/* Patient Resource */}
          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Patient Resource</h3>
              </div>
              
              <p className="leading-relaxed">
                The <strong>Patient</strong> resource is the heart of FHIR. It represents the individual receiving care and contains demographics, identifiers, and contact information.
              </p>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`{
  "resourceType": "Patient",
  "id": "example-patient",
  "identifier": [{
    "system": "http://hospital.org/mrn",
    "value": "12345"
  }],
  "name": [{
    "use": "official",
    "family": "Smith",
    "given": ["John", "Michael"]
  }],
  "gender": "male",
  "birthDate": "1980-01-15",
  "address": [{
    "use": "home",
    "line": ["123 Main Street"],
    "city": "Boston",
    "state": "MA",
    "postalCode": "02101"
  }],
  "telecom": [{
    "system": "phone",
    "value": "555-123-4567",
    "use": "mobile"
  }]
}`}</pre>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <p className="text-sm"><strong>Key Insight:</strong> A patient can have multiple identifiers (MRN, SSN, insurance ID), multiple names (maiden name, married name), and multiple addresses. FHIR handles this complexity elegantly with arrays.</p>
              </div>
            </CardContent>
          </Card>

          {/* Observation Resource */}
          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Observation Resource</h3>
              </div>
              
              <p className="leading-relaxed">
                The <strong>Observation</strong> resource captures measurements, test results, and clinical findings. It's incredibly versatile—used for vital signs, lab results, social history, and more.
              </p>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`{
  "resourceType": "Observation",
  "id": "blood-pressure",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs",
      "display": "Vital Signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "85354-9",
      "display": "Blood pressure panel"
    }]
  },
  "subject": {
    "reference": "Patient/example-patient"
  },
  "effectiveDateTime": "2024-01-15T10:30:00Z",
  "component": [
    {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "8480-6",
          "display": "Systolic blood pressure"
        }]
      },
      "valueQuantity": {
        "value": 120,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "8462-4",
          "display": "Diastolic blood pressure"
        }]
      },
      "valueQuantity": {
        "value": 80,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    }
  ]
}`}</pre>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                <p className="text-sm"><strong>Key Insight:</strong> Notice the <code>subject</code> field with a reference to the Patient. This is how FHIR resources link together—through references that create a web of connected data.</p>
              </div>
            </CardContent>
          </Card>

          {/* MedicationRequest Resource */}
          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Pill className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">MedicationRequest Resource</h3>
              </div>
              
              <p className="leading-relaxed">
                The <strong>MedicationRequest</strong> resource represents a prescription or order for medication. It captures what drug, how much, how often, and for how long.
              </p>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`{
  "resourceType": "MedicationRequest",
  "id": "prescription-001",
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [{
      "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
      "code": "197361",
      "display": "Lisinopril 10 MG Oral Tablet"
    }]
  },
  "subject": {
    "reference": "Patient/example-patient"
  },
  "authoredOn": "2024-01-15",
  "requester": {
    "reference": "Practitioner/dr-jones"
  },
  "dosageInstruction": [{
    "text": "Take one tablet by mouth once daily",
    "timing": {
      "repeat": {
        "frequency": 1,
        "period": 1,
        "periodUnit": "d"
      }
    },
    "route": {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "26643006",
        "display": "Oral route"
      }]
    },
    "doseAndRate": [{
      "doseQuantity": {
        "value": 1,
        "unit": "tablet"
      }
    }]
  }],
  "dispenseRequest": {
    "numberOfRepeatsAllowed": 3,
    "quantity": {
      "value": 30,
      "unit": "tablet"
    },
    "expectedSupplyDuration": {
      "value": 30,
      "unit": "days"
    }
  }
}`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Encounter Resource */}
          <Card className="bg-secondary/20 border-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Encounter Resource</h3>
              </div>
              
              <p className="leading-relaxed">
                The <strong>Encounter</strong> resource represents an interaction between a patient and healthcare provider. It could be an office visit, hospital stay, or telehealth session.
              </p>

              <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`{
  "resourceType": "Encounter",
  "id": "office-visit-001",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "ambulatory"
  },
  "type": [{
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "185349003",
      "display": "Encounter for check up"
    }]
  }],
  "subject": {
    "reference": "Patient/example-patient"
  },
  "participant": [{
    "individual": {
      "reference": "Practitioner/dr-jones"
    }
  }],
  "period": {
    "start": "2024-01-15T09:00:00Z",
    "end": "2024-01-15T09:30:00Z"
  },
  "reasonCode": [{
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "38341003",
      "display": "Hypertensive disorder"
    }]
  }]
}`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Resource Relationships */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">How Resources Connect</h3>
              
              <p className="leading-relaxed">
                FHIR resources form a graph of interconnected data. Here's how a typical patient visit connects:
              </p>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-4">
                    <span className="bg-primary/20 px-3 py-1 rounded">Patient</span>
                    <span>←</span>
                    <span className="bg-purple-500/20 px-3 py-1 rounded">Encounter</span>
                    <span className="text-muted-foreground">(subject reference)</span>
                  </div>
                  <div className="flex items-center gap-4 ml-8">
                    <span className="bg-purple-500/20 px-3 py-1 rounded">Encounter</span>
                    <span>←</span>
                    <span className="bg-green-500/20 px-3 py-1 rounded">Observation</span>
                    <span className="text-muted-foreground">(encounter reference)</span>
                  </div>
                  <div className="flex items-center gap-4 ml-8">
                    <span className="bg-purple-500/20 px-3 py-1 rounded">Encounter</span>
                    <span>←</span>
                    <span className="bg-blue-500/20 px-3 py-1 rounded">MedicationRequest</span>
                    <span className="text-muted-foreground">(encounter reference)</span>
                  </div>
                </div>
              </div>

              <p className="leading-relaxed">
                This reference-based architecture allows you to query related data efficiently. Want all observations from a specific encounter? Just search by the encounter reference.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* The Gauntlet - Quiz */}
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary border-b border-border pb-2">
            The Gauntlet: Test Your Knowledge
          </h2>

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="fhir-resources"
            question="Which FHIR resource would you use to store a patient's blood pressure reading?"
            options={[
              "Patient",
              "Observation",
              "MedicationRequest",
              "Encounter"
            ]}
            correctAnswer={1}
            explanation="The Observation resource is used for measurements, test results, and clinical findings including vital signs like blood pressure."
            eli5Explanation="Observation = watching and measuring things. Blood pressure is something we measure, so it goes in Observation!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="fhir-resources"
            question="How do FHIR resources link to each other?"
            options={[
              "Through foreign keys in a database",
              "Through XML namespaces",
              "Through reference fields containing resource IDs",
              "Through shared session tokens"
            ]}
            correctAnswer={2}
            explanation="FHIR resources connect through reference fields that contain the type and ID of the related resource (e.g., 'Patient/12345')."
            eli5Explanation="It's like putting a friend's phone number in your contacts. The reference is like a phone number that tells you where to find the other resource!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="fhir-resources"
            question="What coding system is commonly used for medication codes in FHIR?"
            options={[
              "ICD-10",
              "CPT",
              "RxNorm",
              "HCPCS"
            ]}
            correctAnswer={2}
            explanation="RxNorm is the standard terminology for clinical drugs in the United States, providing normalized names for medications."
            eli5Explanation="RxNorm is like a universal dictionary for medicine names. It makes sure everyone calls the same pill by the same name!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="fhir-resources"
            question="What does the 'status' field in an Observation resource indicate?"
            options={[
              "The patient's health status",
              "The lifecycle state of the observation (preliminary, final, etc.)",
              "Whether the observation is public or private",
              "The priority level of the observation"
            ]}
            correctAnswer={1}
            explanation="The status field indicates the lifecycle state of the observation—whether it's preliminary, final, amended, or entered in error."
            eli5Explanation="Status tells you if the result is 'still cooking' (preliminary) or 'done and ready' (final). Like knowing if your pizza is still in the oven!"
          />

          <MicroQuiz
            courseId="healthcare-architect"
            topicId="fhir-resources"
            question="Which resource represents a healthcare interaction like an office visit or hospital stay?"
            options={[
              "Appointment",
              "Schedule",
              "Encounter",
              "Episode of Care"
            ]}
            correctAnswer={2}
            explanation="The Encounter resource represents an interaction between a patient and healthcare provider, such as an office visit, hospital admission, or telehealth session."
            eli5Explanation="Encounter = when you actually meet the doctor. It's the 'we met and talked' record, not just the 'we planned to meet' record!"
          />
        </section>

        {/* Navigation */}
        <section className="flex justify-between items-center pt-8 border-t border-border">
          <Link href="/healthcare-architect/hl7-evolution">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous: HL7 Evolution
            </Button>
          </Link>
          <Link href="/healthcare-architect/smart-on-fhir">
            <Button className="gap-2">
              Next: SMART on FHIR
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
