async function getData() {
  return Promise.resolve({
    DBL: !!process.env.DATABASE_URL?.length,
    CSL: !!process.env.CRON_SECRET?.length,
  });
}

export default async function CouncillorDebugPage() {
  const data = await getData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
