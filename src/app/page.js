import ClientPage from '../components/ClientPage';

export default async function Page() {
  let homepageData = null;
  let experiencesData = null;
  let projectsData = null;

  try {
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    };

    const [homepageRes, experiencesRes, projectsRes] = await Promise.all([
      fetch(`${process.env.DIRECTUS_URL}/items/Homepage`, fetchOptions),
      fetch(`${process.env.DIRECTUS_URL}/items/experiences?sort=-id`, fetchOptions),
      fetch(`${process.env.DIRECTUS_URL}/items/Projects?sort=-id`, fetchOptions)
    ]);
    
    if (homepageRes.ok) {
      const json = await homepageRes.json();
      homepageData = json?.data || null;
    }
    
    if (experiencesRes.ok) {
      const json = await experiencesRes.json();
      experiencesData = json?.data || [];
    }
    
    if (projectsRes.ok) {
      const json = await projectsRes.json();
      projectsData = json?.data || [];
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return <ClientPage homepageData={homepageData} experiencesData={experiencesData} projectsData={projectsData} />;
}
