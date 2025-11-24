import { NextRequest, NextResponse } from 'next/server';
import { ConstructAnalyzer } from '@cdklabs/cdk-construct-analyzer';

export async function GET(
  request: NextRequest,
  { params }: { params: { packageName: string } }
) {
  try {
    const { packageName } = params;
    console.log('Analyzing package:', packageName);
    
    const analyzer = new ConstructAnalyzer();
    const result = await analyzer.analyzePackage(decodeURIComponent(packageName));
    
    console.log('Analysis complete:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing package:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze package', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
