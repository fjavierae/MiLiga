"use client"

import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { loginAction } from '@/actions/auth';
import classes from './styles/AuthenticationImage.module.css';

interface AuthenticationImageProps {
  readonly errorMessage?: string;
}

export function AuthenticationImage({ errorMessage }: AuthenticationImageProps) {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Welcome back to MiLiga!
        </Title>

        <form action={loginAction}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            name="email"
            type="email"
            required
            size="md"
            radius="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            name="password"
            required
            mt="md"
            size="md"
            radius="md"
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md" radius="md" type="submit">
            Login
          </Button>
        </form>

        {errorMessage ? (
          <Text c="red" size="sm" mt="md">
            {errorMessage}
          </Text>
        ) : null}

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor href="#" fw={500} onClick={(event) => event.preventDefault()}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
