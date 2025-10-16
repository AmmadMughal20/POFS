"use client"
import Card from "@/components/ui/Card/Card";
import Page from "@/components/ui/Page/Page";
import Link from "next/link";

export default function Home()
{
  return (
    <Page>
      <div className="py-1">
        <Card>
          <h5>Page Title</h5>
        </Card>
      </div>
    </Page>

  );
}
