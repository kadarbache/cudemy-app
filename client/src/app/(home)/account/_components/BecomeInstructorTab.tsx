"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { InstructorFormCheckbox } from "../../instructor/_components/instructor-form-input";
import { MultiSelect, Option } from "../../instructor/_components/multi-select";
import {
  expertiseOptions,
  qualificationOptions,
  specificSkillsOptions,
} from "../../instructor/_libs/options";
import { becomeInstructor } from "../action";

const inputClassName =
  "bg-[var(--input-bg-color)] w-full p-4 rounded-lg outline-none ring-2 ring-[var(--primary-color)] text-[var(--input-text-color)] font-poppins text-[16px] font-normal leading-[24px] placeholder:overflow-hidden";

interface FormState {
  occupation: Option[];
  specificSkills: Option[];
  qualification: Option[];
  yearsOfExpertise: string;
  sampleContentUrl: string;
  termsAndConditions: boolean;
  equipment: boolean;
}

export default function BecomeInstructorTab() {
  const [form, setForm] = useState<FormState>({
    occupation: [],
    specificSkills: [],
    qualification: [],
    yearsOfExpertise: "",
    sampleContentUrl: "",
    termsAndConditions: false,
    equipment: false,
  });

  const [state, formAction, pending] = useActionState(becomeInstructor, null);
  const navigate = useRouter();

  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      toast.success(state.message);
      navigate.push("/dashboard");
    } else {
      toast.error(state.message);
    }
  }, [state, navigate]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-8">
      <p className="text-muted-foreground text-sm max-w-xl text-center">
        Tell us what you teach and we will set your instructor account up right
        away.
      </p>
      <form
        action={formAction}
        className="flex flex-col gap-4 w-[300px] md:w-xl"
      >
        <MultiSelect
          description="What are your main professional roles or occupations?"
          placeholder="Search or select your occupations (e.g., Software Engineer, Marketing Manager, Yoga Instructor)"
          options={expertiseOptions}
          selected={form.occupation}
          name="occupation"
          onChange={(value) => update("occupation", value)}
        />

        <MultiSelect
          description="What specific skills and topics are you qualified to teach?"
          placeholder="Select the subjects you can teach (e.g., Python Programming, Social Media Marketing, Graphic Design)"
          options={specificSkillsOptions}
          selected={form.specificSkills}
          name="specificSkills"
          onChange={(value) => update("specificSkills", value)}
        />

        <Label htmlFor="yearsOfExpertise" className="w-[80%]">
          How many years of professional experience do you have in your field?
        </Label>
        <input
          type="number"
          id="yearsOfExpertise"
          name="yearsOfExpertise"
          min={1}
          max={10}
          value={form.yearsOfExpertise}
          placeholder="Enter years of professional experience (e.g., 3, 7, 12)"
          onChange={(e) => update("yearsOfExpertise", e.target.value)}
          className={inputClassName}
        />

        <MultiSelect
          description="What formal qualifications, certifications, or education support your expertise?"
          placeholder="Select your qualifications or add custom ones (e.g., Bachelor's Degree, AWS Certified, 10+ Years Experience)"
          options={qualificationOptions}
          selected={form.qualification}
          name="qualification"
          onChange={(value) => update("qualification", value)}
        />

        <InstructorFormCheckbox
          selectedOption={form.termsAndConditions}
          onhandleSelectionChange={(_field, value) =>
            update("termsAndConditions", value)
          }
          checkboxId="termsAndConditions"
          label={
            <>
              I agree to the{" "}
              <Link
                href="/instructor/terms"
                target="_blank"
                className="text-[var(--primary-color)] underline"
              >
                Instructor Terms &amp; Conditions
              </Link>{" "}
              and platform guidelines
            </>
          }
          paragraph="By checking this box, you agree to our Instructor Terms of Service and commit to maintaining
  high-quality standards for all course content you publish on our platform."
        />

        <InstructorFormCheckbox
          selectedOption={form.equipment}
          onhandleSelectionChange={(_field, value) => update("equipment", value)}
          checkboxId="equipment"
          label="I confirm I have access to necessary equipment for creating quality course content"
          paragraph="Confirm that you have access to basic recording equipment (microphone, camera, and screen
  recording software) to ensure your students receive a professional learning experience."
        />

        <Label htmlFor="sampleContentUrl" className="w-[80%]">
          Share a link to your existing content (YouTube, portfolio, previous
          courses, etc.)
        </Label>
        <input
          type="url"
          id="sampleContentUrl"
          name="sampleContentUrl"
          value={form.sampleContentUrl}
          placeholder="https://youtube.com/your-video-sample or https://your-portfolio.com"
          onChange={(e) => update("sampleContentUrl", e.target.value)}
          className={inputClassName}
        />

        <Button
          size="lg"
          variant="primary"
          className="w-full bg-[var(--primary-color)] text-white hover:bg-primary/80 focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer mt-2"
          type="submit"
          disabled={pending}
        >
          Become an Instructor
        </Button>
      </form>
    </div>
  );
}
