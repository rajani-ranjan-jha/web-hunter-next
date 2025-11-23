'use client'
import Card from '@/app/components/Card';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const ShowDataByCategory = () => {
  const { category_name } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {data: session, status} = useSession();

  // GET BY CATEGORY NAME
  async function GetByCategoryName(categoryName) {
    console.log("Category name", categoryName)
    try {
      const response = await fetch('/api/web/filter-by-category', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category_name: categoryName })
      });

      const result = await response.json();
      if (!response.ok) {
        console.warn(result.message);
        setError(result.message);
        return false;
      } else {
        // console.log(result)
        setData(result.data || []);
        return result.data;
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!category_name) {
      setError('Category name is missing');
      setLoading(false);
      return;
    }
    GetByCategoryName(category_name);
  }, [category_name])

  if (status === 'loading' || loading) {
    return (
      <><LoadingSpinner/></>
    );
  }

  if (error) {
    return (
      <div className='bg-black text-white min-h-screen flex items-center justify-center'>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div className='py-25 px-5 md:px-10 lg:px-20 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8'>Showing data for category: {category_name.replaceAll('-',' ')[0].toUpperCase() + category_name.replaceAll('-',' ').slice(1)}</h1>
      {data.length > 0 ? (
        <div className='flex flex-wrap justify-center gap-6'>
          {data.map((item) => (
            <Card
            name={item.name}
            url={item.url}
            description={item.description}
            tags={item.tags}
            id={item._id}
            key={item._id}
            
            />
          ))}

        </div>
      ) : (
        <p>No data found for this category.</p>
      )}
    </div>
  )
}

export default ShowDataByCategory
