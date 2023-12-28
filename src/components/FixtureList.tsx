import { Box } from "@mui/material";
import { BaseFixture } from "../engine/fixtures/BaseFixture"
import { FixtureCard } from "./FixtureList/FixtureCard";

export type FixtureListProps = {
    fixtures: BaseFixture[]
    reRenderHook: () => void
}

export const FixtureList = (props: FixtureListProps) => {
    const { fixtures, reRenderHook } = props;
    return (
        <Box sx={{ paddingLeft: 2, marginRight: 2, paddingTop: 2 }}>
            {fixtures.map((fixture) => (
                <FixtureCard key={fixture.instanceName} reRenderHook={reRenderHook} fixture={fixture} />
            ))}
        </Box>
    )
}