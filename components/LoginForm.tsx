import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { signIn } from "next-auth/client";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import FormDivider from "./FormDivider";
import { AppProviders } from "next-auth/providers";

const icons = {
  github: <AiFillGithub />,
  google: <FcGoogle />,
  twitter: <AiOutlineTwitter />,
};

interface LoginFormProps {
  providers: AppProviders;
  token: string;
}

export default function LoginForm({ providers, token }: LoginFormProps) {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = values;
  const [show, setShow] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const toggle = (e) => {
    setShow(!show);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      toast({
        title: "Error",
        variant: "left-accent",
        position: "top-right",
        description: result.error,
        status: "error",
        isClosable: true,
        duration: 4000,
      });
    } else {
      router.push("/");
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Text
          as="h2"
          fontSize="lg"
          textAlign="center"
          marginTop={2}
          fontWeight="medium"
        >
          Welcome Back!
        </Text>

        <Stack spacing={6}>
          <Input name="csrfToken" type="hidden" defaultValue={token} />
          <FormControl id="email" isRequired>
            <FormLabel fontSize={{ base: "sm", md: "md" }}>
              Email address
            </FormLabel>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              fontSize={{ base: "sm", md: "md" }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={handleChange}
                fontSize={{ base: "sm", md: "md" }}
              />
              <InputRightElement width="3rem">
                <IconButton
                  aria-label="Toggle Login Password"
                  h="1.75rem"
                  onClick={toggle}
                  colorScheme="gray"
                  icon={show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit">Sign In</Button>
        </Stack>
        <Box>
          <Text fontSize={{ base: "sm", md: "md" }}>
            Don't have an account?{" "}
            <Link color="blue.500" fontWeight="bold" href="/signup">
              Sign Up
            </Link>
          </Text>
        </Box>
      </form>
      <FormDivider text="or" />
      {Object.values(providers).map((provider) => {
        if (provider.name === "Credentials") {
          return;
        }

        return (
          <Button
            variant="outline"
            w="full"
            key={provider.name}
            my={2}
            leftIcon={icons[provider.id]}
            colorScheme={provider.id}
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: `${process.env.NEXTAUTH_URL}`,
              })
            }
          >
            Sign in with {provider.name}
          </Button>
        );
      })}
    </Box>
  );
}
