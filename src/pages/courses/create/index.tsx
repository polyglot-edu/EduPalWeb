import { useUser } from "@auth0/nextjs-auth0/client";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import CourseCreationStepper from "../../../components/CourseCreation/CourseCreationStepper";
import Layout from "../../../components/Layout/LayoutPages";

export default function CourseCreatePage() {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { user } = useUser();

  const handleNavigate = (route: string) => {
    console.log("Navigate to:", route);
  };

  useEffect(() => {
    if (user || process.env.TEST_MODE === "true") {
      console.log("User is available:", user);
    }
  }, [user]);

  return (
    <Layout
      user={user}
      isOpen={isOpen}
      onToggle={onToggle}
      handleNavigate={handleNavigate}
    >
      <CourseCreationStepper />
    </Layout>
  );
}
