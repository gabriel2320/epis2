import { copy } from '@epis2/design-system';

import { Link, Outlet } from '@tanstack/react-router';

import { useAuth } from '../auth/AuthContext.js';

import { ActivePatientBanner } from '../components/ActivePatientBanner.js';



import {

  AppBar,

  Box,

  Button,

  Container,

  EpisBrandMark,

  EpisAppearancePreferencesLink,
  EpisThemeModeToggle,

  LogoutIcon,

  Stack,

  Typography,

  epis2CanvasSx,

  epis2IslandMarginSx,

} from '@epis2/epis2-ui';



export function ClinicalShellLayout() {

  const { session, logout } = useAuth();



  return (

    <Box sx={epis2CanvasSx}>

      <AppBar

        position="static"

        color="transparent"

        elevation={0}

        sx={{
          borderBottom: 'none',
          borderRadius: 0,
          bgcolor: 'background.default',
          backdropFilter: 'none',
          backgroundImage: 'none',
        }}

      >

        <Box sx={{ width: '100%', px: { xs: 3, sm: 4, md: 5 }, py: 2 }}>

          <Stack spacing={1.25}>

            <Stack

              direction="row"

              alignItems="center"

              flexWrap="wrap"

              useFlexGap

              gap={1}

              sx={{ width: '100%' }}

            >

              <Typography

                variant="subtitle1"

                component={Link}

                to="/comando"

                color="primary"

                sx={{

                  textDecoration: 'none',

                  fontWeight: 700,

                  display: 'flex',

                  alignItems: 'center',

                  gap: 0.75,

                  flexShrink: 0,

                }}

              >

                <EpisBrandMark size={28} />

                {copy.appName}

              </Typography>



              <Box sx={{ flex: 1, minWidth: 8 }} />



              {session ? (

                <Typography

                  variant="body1"

                  color="text.secondary"

                  sx={{ flexShrink: 0, maxWidth: { xs: '100%', sm: 200 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}

                >

                  {session.user.displayName}

                </Typography>

              ) : null}



              <Button component={Link} to="/comando" size="small" sx={{ flexShrink: 0 }}>

                {copy.layout.backToCommand}

              </Button>

              <EpisAppearancePreferencesLink data-testid="epis2-clinical-appearance-link" />
              <EpisThemeModeToggle data-testid="epis2-clinical-theme-toggle" />

              <Button

                size="small"

                color="inherit"

                startIcon={<LogoutIcon />}

                onClick={logout}

                sx={{ flexShrink: 0 }}

              >

                {copy.layout.logout}

              </Button>

            </Stack>



            <Box sx={{ width: '100%', pt: 0.25 }}>

              <ActivePatientBanner />

            </Box>

          </Stack>

        </Box>

      </AppBar>

      <Container maxWidth={false} disableGutters sx={{ ...epis2IslandMarginSx, maxWidth: 920 }}>

        <Outlet />

      </Container>

    </Box>

  );

}

